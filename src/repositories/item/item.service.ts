import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ItemEntity } from './item.entity';
import { SellerEntity } from '../seller/seller.entity';
import { CreateItemDto, UpdateItemDto, ViewItemSelects } from './item.dto';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(ItemEntity)
        private itemRepository: Repository<ItemEntity>,
    ) {}

    async create(seller: SellerEntity, createItem: CreateItemDto) {
        const item = new ItemEntity();
        Object.assign(item, createItem);
        item.seller = seller;
        const createdItem = await this.itemRepository.save(item);
        return createdItem;
    }

    async createItemInBulk(seller: SellerEntity, items: CreateItemDto[]) {
        const createdItems = await this.itemRepository.save(
            items.map((item) => {
                const _item = new ItemEntity();
                Object.assign(_item, item);
                _item.seller = seller;
                return _item;
            }),
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

    async update(seller: SellerEntity, updateItem: UpdateItemDto) {
        const item = await this.itemRepository.preload({
            id: updateItem.id,
            ...updateItem,
        });
        if (item.seller.id !== seller.id) {
            throw new ForbiddenException();
        }
        return await this.itemRepository.save(item);
    }

    async findItemsFromCatalogByProductSetReferences(
        seller: SellerEntity,
        productSetReferences: string[],
    ) {
        return await this.itemRepository.find({
            where: {
                seller,
                product_set_reference: In([...productSetReferences]),
            },
            select: {
                product_set_reference: true,
                id: true,
            },
        });
    }
}
