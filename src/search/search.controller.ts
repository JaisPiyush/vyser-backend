import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { GetSeller } from 'src/shared/decorators';
import { SellerEntity } from 'src/repositories/seller/seller.entity';

@Controller('search/item')
export class SearchController {
    constructor(private searchService: SearchService) {}

    @Post('text')
    @HttpCode(200)
    async textSearch(@Body('name') name: string) {
        return { items: await this.searchService.textSearchItem(name) };
    }

    @Post('vision/global')
    @HttpCode(200)
    async globalVisionSearch(
        @Body('image') image: string,
        @GetSeller() seller: SellerEntity,
    ) {
        return await this.searchService.visionGlobalSearchItem(image, seller);
    }

    @Post('vision/catalog')
    @HttpCode(200)
    async catalogVisionSearch(
        @Body('image') image: string,
        @GetSeller() seller: SellerEntity,
    ) {
        return await this.searchService.visionCatalogSearchItem(image, seller);
    }
}
