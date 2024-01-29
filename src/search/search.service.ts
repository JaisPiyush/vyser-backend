import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ViewItemSelects } from 'src/repositories/item/item.dto';
import { ItemEntity } from 'src/repositories/item/item.entity';
import { Repository } from 'typeorm';
import * as vision from '@google-cloud/vision';

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(ItemEntity)
        private readonly itemRepository: Repository<ItemEntity>,
        private imageAnnotationClient: vision.ImageAnnotatorClient = new vision.ImageAnnotatorClient(),
        private productSearchClient: vision.ProductSearchClient = new vision.ProductSearchClient(),
    ) {}

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
        // Write code for vision product search
        const productSetPath = this.productSearchClient.productSetPath(
            process.env.GOOGLE_CLOUD_PROJECT,
            process.env.GOOGLE_CLOUD_LOCATION,
            process.env.GOOGLE_CLOUD_PRODUCT_SET_ID,
        );
        const content = base64EncodedImage;
        const request: vision.protos.google.cloud.vision.v1.IAnnotateImageRequest =
            {
                image: {
                    content: content,
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
