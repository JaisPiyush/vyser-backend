import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ViewItemSelects } from 'src/repositories/item/item.dto';
import { ItemEntity } from 'src/repositories/item/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(ItemEntity)
        private readonly itemRepository: Repository<ItemEntity>,
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
}
