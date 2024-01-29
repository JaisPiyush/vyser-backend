import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { CreateItemDto, UpdateItemDto } from 'src/repositories/item/item.dto';
import { ItemService } from 'src/repositories/item/item.service';
import { SellerEntity } from 'src/repositories/seller/seller.entity';
import { GetSeller } from 'src/shared/decorators';

@Controller('item')
export class ItemController {
    constructor(private itemService: ItemService) {}

    @Post()
    @HttpCode(201)
    async create(
        @GetSeller() seller: SellerEntity,
        @Body() createItemDto: CreateItemDto,
    ) {
        const item = await this.itemService.create(seller, createItemDto);
        return {
            item_id: item.id,
        };
    }

    @Get()
    async find(
        @GetSeller() seller: SellerEntity,
        @Query('item_id') item_id?: string,
    ) {
        if (item_id) {
            return {
                items: [await this.itemService.findByItemId(item_id)],
            };
        }
        return { items: await this.itemService.findAllBySeller(seller) };
    }

    @Put()
    @HttpCode(201)
    async update(@Body() updateItemDto: UpdateItemDto) {
        return { items: [await this.itemService.update(updateItemDto)] };
    }
}
