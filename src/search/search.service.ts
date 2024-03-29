import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { ViewItemSelects } from 'src/repositories/item/item.dto';
import { ItemEntity } from 'src/repositories/item/item.entity';
import { Repository } from 'typeorm';
import { GoogleCloudService } from 'src/shared/gc.service';
import { VisionProductSearchResponse } from 'src/shared/types';
import { ItemService } from 'src/repositories/item/item.service';
import { SellerEntity } from 'src/repositories/seller/seller.entity';

@Injectable()
export class SearchService {
    constructor(
        private readonly googleCloudService: GoogleCloudService,
        @InjectRepository(ItemEntity)
        private readonly itemRepository: Repository<ItemEntity>,
        private readonly itemService: ItemService,
    ) {}

    async textSearchItem(searchText: string) {
        // return await this.itemRepository.find({
        //     where: [
        //         {
        //             name_tsv: searchText,
        //         },
        //     ],
        //     select: ViewItemSelects,
        // });
        return await this.itemRepository
            .createQueryBuilder('item_entity')
            .where(
                "to_tsvector('english', item_entity.name) @@ to_tsquery('english', :searchText)",
                {
                    searchText,
                },
            )
            .getMany();
    }

    async visionGlobalSearchItem(
        imageUri: string,
        seller?: SellerEntity,
    ): Promise<VisionProductSearchResponse> {
        const results =
            await this.googleCloudService.visionSearchItem(imageUri);
        const productSetReferences =
            this.googleCloudService.getProductReferencesFromSearchResults(
                results,
            );
        const itemsInCatalog =
            seller === undefined
                ? []
                : await this.itemService.findItemsFromCatalogByProductSetReferences(
                      seller,
                      productSetReferences,
                  );
        const products =
            this.googleCloudService.formatGlobalProductVisionSearchResponse(
                results,
                itemsInCatalog,
            );
        for (const index in products) {
            for (const jIndex in products[index].results) {
                const product = products[index].results[jIndex];
                const image =
                    await this.googleCloudService.getImageUriFromReferenceImage(
                        product.image,
                    );
                product.image =
                    this.googleCloudService.getPublicUrlForGSSchemaUri(image);
                products[index].results[jIndex] = product;
            }
        }
        return {
            image: this.googleCloudService.getPublicUrlForGSSchemaUri(imageUri),
            products,
        };
    }

    async visionCatalogSearchItem(
        imageUri: string,
        seller: SellerEntity,
    ): Promise<VisionProductSearchResponse> {
        const results =
            await this.googleCloudService.visionSearchItem(imageUri);
        const productSetReferences =
            this.googleCloudService.getProductReferencesFromSearchResults(
                results,
            );
        const itemsInCatalog =
            await this.itemService.findItemsFromCatalogByProductSetReferences(
                seller,
                productSetReferences,
            );
        const products =
            this.googleCloudService.formatCatalogProductVisionSearchResponse(
                results,
                itemsInCatalog,
            );
        for (const index in products) {
            for (const jIndex in products[index].results) {
                const product = products[index].results[jIndex];
                const image =
                    await this.googleCloudService.getImageUriFromReferenceImage(
                        product.image,
                    );
                product.image =
                    this.googleCloudService.getPublicUrlForGSSchemaUri(image);
                products[index].results[jIndex] = product;
            }
        }
        return {
            image: this.googleCloudService.getPublicUrlForGSSchemaUri(imageUri),
            products,
        };
    }
}
