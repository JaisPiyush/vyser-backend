import { IsArray, IsNotEmpty } from 'class-validator';
import { MediaFile } from 'src/shared/types';
import { CreateLocationDto, LocationDto } from '../location/location.dto';

export class CreateSellerDto {
    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    descriptor_name: string;
    descriptor_code?: string;
    descriptor_short_desc?: string;
    descriptor_long_desc?: string;
    descriptor_media: MediaFile[];
    descriptor_images: string[];
    attributes: { key: string; value: unknown }[];
    @IsArray()
    @IsNotEmpty()
    locations: CreateLocationDto[];
    category_id?: string;
    is_store_active?: boolean;
    uid?: string;
}

export class SellerDto extends CreateSellerDto {
    @IsNotEmpty()
    id: string;
    category_id: string;
    is_store_active: boolean;
    @IsNotEmpty()
    uid: string;
    @IsArray()
    @IsNotEmpty()
    locations: LocationDto[];
}

export class UpdateSellerDto {
    is_store_active?: boolean;
}
