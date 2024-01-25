import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerEntity } from './seller.entity';
import { LocationService } from '../location/location.service';
import { CreateSellerDto } from './seller.dto';

@Injectable()
export class SellerService {
    constructor(
        @InjectRepository(SellerEntity)
        private sellerRepository: Repository<SellerEntity>,
        private locationService: LocationService,
    ) {}

    async create(uid: string, seller: CreateSellerDto) {
        const locations = await this.locationService.createBulk(
            seller.locations,
        );
        seller.uid = uid;
        seller.locations = locations;
        return await this.sellerRepository.create(seller);
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
}
