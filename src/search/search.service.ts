import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ViewItemSelects } from 'src/repositories/item/item.dto';
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
        return await this.itemRepository.find({
            where: [
                {
                    name_tsv: searchText,
                },
            ],
            select: ViewItemSelects,
        });
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
        return {
            image: imageUri,
            products:
                this.googleCloudService.formatGlobalProductVisionSearchResponse(
                    results,
                    itemsInCatalog,
                ),
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
        return {
            image: imageUri,
            products:
                this.googleCloudService.formatCatalogProductVisionSearchResponse(
                    results,
                    itemsInCatalog,
                ),
        };
    }
}
