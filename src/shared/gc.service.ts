import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as vision from '@google-cloud/vision';
import {
    VisionProductSearchResponse,
    VisionProductSearchSingleProductResults,
} from 'src/shared/types';

@Injectable()
export class GoogleCloudService {
    private readonly imageAnnotationClient: vision.ImageAnnotatorClient;
    private readonly productSearchClient: vision.ProductSearchClient;
    readonly GOOGLE_CLOUD_VISION_BASE_URL = 'https://vision.googleapis.com/v1/';
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
    }

    private __formatGlobalProductVisionSearchResponse(
        response: any,
    ): VisionProductSearchSingleProductResults[] {
        const { productSearchResults } = response;
        const { productGroupedResults } = productSearchResults;
        return (productGroupedResults as any[]).map((productGroupedResult) => {
            return {
                bounding_poly: productGroupedResult.boundingPoly
                    .normalizedVertices as Array<{ x: number; y: number }>,
                results: productGroupedResult.results.map((result) => {
                    const product_labels = result.product
                        .productLabels as Array<{ key: string; value: string }>;
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
                        is_item_in_catalog: false,
                        item_id: null,
                    };
                }),
            };
        });
    }

    private async __visionSearchItem(imageUri: string) {
        console.log(
            this.configService.get('GOOGLE_APPLICATION_DEFAULT_CREDENTIALS'),
        );
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

    async visionSearchItem(
        imageUri: string,
    ): Promise<VisionProductSearchResponse> {
        const results = await this.__visionSearchItem(imageUri);
        return {
            products: this.__formatGlobalProductVisionSearchResponse(results),
            image: imageUri,
        };
    }
}
