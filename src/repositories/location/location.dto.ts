import { IsDefined, IsNotEmpty, IsNumberString } from 'class-validator';
import { Point } from 'geojson';

export class CreateLocationDto {
    @IsNotEmpty()
    address: string;
    @IsNotEmpty()
    city: string;
    @IsNotEmpty()
    state: string;
    @IsNotEmpty()
    district: string;
    @IsNotEmpty()
    country: string;
    @IsNotEmpty()
    @IsNumberString()
    area_code: string;
    gps?: Point;
}

export class LocationDto extends CreateLocationDto {
    @IsDefined()
    id: number;
}
