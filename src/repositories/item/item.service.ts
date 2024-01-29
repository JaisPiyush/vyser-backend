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

    async createItemInBulk(seller: SellerEntity, items: CreateItemDto[]) {
        const createdItems = await this.itemRepository.save(
            items.map((item) => ({ ...item, seller })),
        );
        return createdItems;
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

    async update(seller: SellerEntity, item: UpdateItemDto) {
        await this.itemRepository
            .createQueryBuilder()
            .where('id = :id AND seller_id = :seller_id', {
                id: item.id,
                seller_id: seller.id,
            })
            .update(ItemEntity)
            .set(item)
            .execute();
        return await this.findByItemId(item.id);
    }
}
