import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as vision from '@google-cloud/vision';
import { VisionProductSearchSingleProductResults } from 'src/shared/types';
import { ItemEntity } from 'src/repositories/item/item.entity';
import { Storage } from '@google-cloud/storage';
import { SessionsClient } from '@google-cloud/dialogflow-cx';
import { deserializeChatbotResponseFieldValue } from './deserializer';

export enum GoogleCloudBuckets {
    VYSER_STORAGE = 'vyser-storage',
    VYSER_TEMPORARY_IMAGE_BUCKET = 'vyser-temporary-image-bucket',
}

@Injectable()
export class GoogleCloudService {
    private readonly imageAnnotationClient: vision.ImageAnnotatorClient;
    private readonly productSearchClient: vision.ProductSearchClient;
    readonly GOOGLE_CLOUD_VISION_BASE_URL = 'https://vision.googleapis.com/v1/';
    private readonly storageClient: Storage;
    private readonly dialogflowClient: SessionsClient;

    readonly GOOGLE_CLOUD_STORAGE_BASE_PUBLIC_URL =
        'https://storage.googleapis.com/';

    constructor(private readonly configService: ConfigService) {
        const keyFilename = this.configService.get(
            'GOOGLE_APPLICATION_DEFAULT_CREDENTIALS',
        );
        this.imageAnnotationClient = new vision.ImageAnnotatorClient({
            keyFilename: keyFilename,
        });
        this.productSearchClient = new vision.ProductSearchClient({
            keyFilename: keyFilename,
        });
        this.storageClient = new Storage({ keyFilename: keyFilename });
        this.dialogflowClient = new SessionsClient({
            keyFilename: keyFilename,
            apiEndpoint: 'asia-south1-dialogflow.googleapis.com',
        });
    }

    getProductReferencesFromSearchResults(response: any) {
        const { productSearchResults } = response;
        const { results } = productSearchResults;
        return results.map((result) => result.product.name);
    }

    getGSSchemaUriForPublicUrl(publicUrl: string) {
        return publicUrl.replace(
            this.GOOGLE_CLOUD_STORAGE_BASE_PUBLIC_URL,
            'gs://',
        );
    }

    getPublicUrlForGSSchemaUri(gsSchemaUri: string) {
        return gsSchemaUri.replace(
            'gs://',
            this.GOOGLE_CLOUD_STORAGE_BASE_PUBLIC_URL,
        );
    }

    getBucketNameAndFileNameFromGSSchemaUri(gsSchemaUri: string) {
        const bucketName = gsSchemaUri.split('/')[2];
        const fileName = gsSchemaUri.split('/').slice(3).join('/');
        return { bucketName, fileName };
    }

    async deleteImageFromStorage(gsSchemaUri: string) {
        const { bucketName, fileName } =
            this.getBucketNameAndFileNameFromGSSchemaUri(gsSchemaUri);
        const bucket = this.storageClient.bucket(bucketName);
        await bucket.file(fileName).delete();
    }

    async uploadImageToStorage(
        image: Express.Multer.File,
        name: string,
        bucketName?: string,
    ) {
        bucketName = bucketName || GoogleCloudBuckets.VYSER_STORAGE;
        const bucket = this.storageClient.bucket(bucketName);
        const blob = bucket.file(name);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });
        blobStream.on('error', (err) => {
            throw err;
        });
        blobStream.on('finish', () => {
            // blob.makePublic();
        });
        blobStream.end(image.buffer);
        return blob.publicUrl();
    }

    private __formatSingleProductVisionResult(
        results: any[],
        itemsInCatalog: ItemEntity[],
        filterOutItemsInCatalog: boolean,
        onlyReturnItemsInCatalog: boolean,
    ) {
        return results
            .map((result) => {
                const product_labels = result.product.productLabels as Array<{
                    key: string;
                    value: string;
                }>;
                const item = itemsInCatalog.find(
                    (item) =>
                        item.product_set_reference === result.product.name,
                );
                if (filterOutItemsInCatalog && item !== undefined) {
                    return null;
                } else if (onlyReturnItemsInCatalog && item === undefined) {
                    return null;
                }
                return {
                    product_labels: product_labels,
                    name: result.product.name as string,
                    display_name: result.product.displayName as string,
                    description: result.product.description as string,
                    score: result.score as number,
                    image: (this.GOOGLE_CLOUD_VISION_BASE_URL +
                        result.image) as string,
                    is_item_group:
                        product_labels.filter(
                            (product_label) =>
                                product_label.key === 'is_item_group' &&
                                product_label.value === '1',
                        ).length > 0,
                    item_group_id:
                        product_labels.find(
                            (product_label) =>
                                product_label.key === 'item_group_id',
                        )?.value ?? null,
                    is_item_in_catalog: item !== undefined,
                    item_id: item?.id ?? null,
                };
            })
            .filter((result) => result !== null);
    }

    private __formatProductVisionSearchResponse(
        response: any,
        itemsInCatalog: ItemEntity[],
        filterOutItemsInCatalog: boolean,
        onlyReturnItemsInCatalog: boolean,
    ): VisionProductSearchSingleProductResults[] {
        const { productSearchResults } = response;
        const { productGroupedResults } = productSearchResults;
        return (productGroupedResults as any[]).map((productGroupedResult) => {
            const results = productGroupedResult.results;
            return {
                bounding_poly: productGroupedResult.boundingPoly
                    .normalizedVertices as Array<{ x: number; y: number }>,
                results: this.__formatSingleProductVisionResult(
                    results,
                    itemsInCatalog,
                    filterOutItemsInCatalog,
                    onlyReturnItemsInCatalog,
                ),
            };
        });
    }

    formatGlobalProductVisionSearchResponse(
        response: any,
        itemsInCatalog: ItemEntity[],
    ): VisionProductSearchSingleProductResults[] {
        return this.__formatProductVisionSearchResponse(
            response,
            itemsInCatalog,
            true,
            false,
        );
    }

    formatCatalogProductVisionSearchResponse(
        response: any,
        itemsInCatalog: ItemEntity[],
    ): VisionProductSearchSingleProductResults[] {
        return this.__formatProductVisionSearchResponse(
            response,
            itemsInCatalog,
            false,
            true,
        );
    }

    async visionSearchItem(imageUri: string) {
        const productSetPath = this.productSearchClient.productSetPath(
            this.configService.get('GOOGLE_PROJECT_ID'),
            this.configService.get('GOOGLE_CLOUD_VISION_LOCATION'),
            this.configService.get('GOOGLE_CLOUD_VISION_PRODUCT_SET_ID'),
        );
        const content = imageUri;
        const request: vision.protos.google.cloud.vision.v1.IAnnotateImageRequest =
            {
                image: {
                    source: {
                        gcsImageUri: content,
                    },
                },
                features: [{ type: 'PRODUCT_SEARCH' }],
                imageContext: {
                    productSearchParams: {
                        productSet: productSetPath,
                        productCategories: ['homegoods-v2'],
                    },
                },
            };
        const [response] = await this.imageAnnotationClient.batchAnnotateImages(
            { requests: [request] },
        );
        const results = response?.responses[0] || {};
        return results;
    }

    async detectIntent(sessionId: string, query: string) {
        const sessionPath =
            this.dialogflowClient.projectLocationAgentSessionPath(
                this.configService.get('GOOGLE_PROJECT_ID'),
                'asia-south1',
                'debc41a7-94c2-4cea-a6fd-31d379d0a50f',
                sessionId,
            );
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: query,
                },
                languageCode: 'en-in',
            },
        };
        const [response] = await this.dialogflowClient.detectIntent(request);
        const responseMessages = response.queryResult.responseMessages;
        if (responseMessages.length === 0) {
            return {};
        }
        return deserializeChatbotResponseFieldValue({
            kind: 'structValue',
            structValue: responseMessages[0].payload as any,
        });
    }
}
