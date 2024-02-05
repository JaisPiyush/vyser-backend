import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductSetEntity } from './product-set.entity';

@Injectable()
export class ProductSetService {
    constructor(
        @InjectRepository(ProductSetEntity, 'supabase')
        private readonly productSetRepository: Repository<ProductSetEntity>,
    ) {}

    async getProductsByIds(ids: string[]) {
        return this.productSetRepository.find({
            where: {
                id: In(ids),
            },
        });
    }

    async getProductByReferences(references: string[]) {
        return this.productSetRepository.find({
            where: {
                product_id: In(references),
            },
        });
    }
}
