import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemEntity } from './item.entity';
import { SellerEntity } from '../seller/seller.entity';
import { CreateItemDto, UpdateItemDto, ViewItemSelects } from './item.dto';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(ItemEntity)
        private itemRepository: Repository<ItemEntity>,
    ) {}

    async create(seller: SellerEntity, item: CreateItemDto) {
        const createdItem = await this.itemRepository.save({
            ...item,
            seller,
        });
        return createdItem;
    }

    async findAllBySeller(seller: SellerEntity) {
        return await this.itemRepository.find({
            where: { seller },
            select: ViewItemSelects,
        });
    }

    async findByItemId(itemId: string) {
        return await this.itemRepository.findOne({
            where: {
                id: itemId,
            },
            select: ViewItemSelects,
        });
    }

    async update(item: UpdateItemDto) {
        await this.itemRepository.update(item.id, item);
        return await this.findByItemId(item.id);
    }
}
