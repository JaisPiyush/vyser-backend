import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search/item')
export class SearchController {
    constructor(private searchService: SearchService) {}

    @Post('text')
    async textSearch(@Body('name') name: string) {
        return { items: [await this.searchService.textSearchItem(name)] };
    }

    @Post('vision/global')
    async globalVisionSearch(@Body('image') image: string) {
        return {
            items: [await this.searchService.visionSearchItem(image)],
        };
    }
}
