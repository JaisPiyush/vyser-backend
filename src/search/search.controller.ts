import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private searchService: SearchService) {}

    @Post('item/text')
    async textSearch(@Body('name') name: string) {
        return { items: [await this.searchService.textSearchItem(name)] };
    }
}
