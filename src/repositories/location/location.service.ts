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
    async create(createLocation: CreateLocationDto) {
        const location = new LocationEntity();
        Object.assign(location, createLocation);
        return await this.locationRepository.save(location);
    }

    async createBulk(createLocations: CreateLocationDto[]) {
        const locations = createLocations.map((location) => {
            const _location = new LocationEntity();
            Object.assign(_location, location);
            return _location;
        });
        return await this.locationRepository.save(locations);
    }
}
