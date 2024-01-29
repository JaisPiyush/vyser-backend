import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ViewItemSelects } from 'src/repositories/item/item.dto';
import { ItemEntity } from 'src/repositories/item/item.entity';
import { Repository } from 'typeorm';
import * as vision from '@google-cloud/vision';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchService {
    private readonly imageAnnotationClient: vision.ImageAnnotatorClient;
    private readonly productSearchClient: vision.ProductSearchClient;
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(ItemEntity)
        private readonly itemRepository: Repository<ItemEntity>,
    ) {
        this.imageAnnotationClient = new vision.ImageAnnotatorClient({
            keyFilename: this.configService.get(
                'GOOGLE_APPLICATION_DEFAULT_CREDENTIALS',
            ),
        });
        this.productSearchClient = new vision.ProductSearchClient({
            keyFilename: this.configService.get(
                'GOOGLE_APPLICATION_DEFAULT_CREDENTIALS',
            ),
        });
    }

    async textSearchItem(searchText: string) {
        return await this.itemRepository.find({
            where: [
                {
                    name_tsv: searchText,
                },
            ],
            select: ViewItemSelects,
        });
    }

    async visionSearchItem(base64EncodedImage: string) {
        console.log(
            this.configService.get('GOOGLE_APPLICATION_DEFAULT_CREDENTIALS'),
        );
        const productSetPath = this.productSearchClient.productSetPath(
            this.configService.get('GOOGLE_PROJECT_ID'),
            this.configService.get('GOOGLE_CLOUD_VISION_LOCATION'),
            this.configService.get('GOOGLE_CLOUD_VISION_PRODUCT_SET_ID'),
        );
        const content = base64EncodedImage;
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
        const results =
            response?.responses?.[0]?.productSearchResults?.results || [];
        return results;
    }
}
