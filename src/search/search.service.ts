import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ViewItemSelects } from 'src/repositories/item/item.dto';
import { ItemEntity } from 'src/repositories/item/item.entity';
import { Repository } from 'typeorm';
import { GoogleCloudService } from 'src/shared/gc.service';

@Injectable()
export class SearchService {
    constructor(
        private readonly googleCloudService: GoogleCloudService,
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

    async visionSearchItem(imageUri: string) {
        return await this.googleCloudService.visionSearchItem(imageUri);
    }
}
