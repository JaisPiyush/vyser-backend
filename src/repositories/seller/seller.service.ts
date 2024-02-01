import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerEntity } from './seller.entity';
import { LocationService } from '../location/location.service';
import { CreateSellerDto, UpdateSellerDto } from './seller.dto';

@Injectable()
export class SellerService {
    constructor(
        @InjectRepository(SellerEntity)
        private sellerRepository: Repository<SellerEntity>,
        private locationService: LocationService,
    ) {}

    async create(uid: string, createSeller: CreateSellerDto) {
        const locations = await this.locationService.createBulk(
            createSeller.locations,
        );
        createSeller.uid = uid;
        createSeller.locations = locations;
        const seller = new SellerEntity();
        Object.assign(seller, createSeller);
        return await this.sellerRepository.save(seller);
    }

    async get(uid: string) {
        return await this.sellerRepository.findOne({
            where: {
                uid,
            },
            relations: {
                locations: true,
            },
        });
    }

    async update(_seller: SellerEntity, updateDto: UpdateSellerDto) {
        return await this.sellerRepository.update(_seller.id, {
            is_store_active: updateDto.is_store_active,
        });
    }
}
