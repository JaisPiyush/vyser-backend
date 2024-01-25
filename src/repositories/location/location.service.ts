import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from './location.entity';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(LocationEntity)
        private locationRepository: Repository<LocationEntity>,
    ) {}
    async create(location: CreateLocationDto) {
        return await this.locationRepository.create(location);
    }

    async createBulk(locations: CreateLocationDto[]) {
        return await this.locationRepository.create(locations);
    }
}
