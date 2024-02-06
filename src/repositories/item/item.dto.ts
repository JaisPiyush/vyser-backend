import { IsDefined } from 'class-validator';
import {
    MediaFile,
    DescriptorAdditionalDesc,
    Attribute,
} from 'src/shared/types';

export class CreateItemDto {
    name: string;
    product_set_reference: string;
    descriptor_name: string;
    descriptor_code?: string;
    descriptor_short_desc?: string;
    descriptor_long_desc?: string;
    descriptor_media: Array<MediaFile>;
    descriptor_images: string[];
    descriptor_additional_desc: DescriptorAdditionalDesc[];
    creator: string;
    price: number;
    price_currency: string;
    quantity: number;
    reorder_level: number;
    is_active: boolean;
    category_ids: string[];
    attributes: { attributes: { key: string; value: unknown }[] };
    unit: string;
}

export class CreateItemUsingProductReferenceDto {
    product_set_reference: string;
    price: number;
    quantity: number;
    reorder_level: number;
}

export class UpdateItemDto {
    @IsDefined()
    id: string;
    price?: number;
    price_currency?: string;
    quantity?: number;
    reorder_level?: number;
    is_active?: boolean;
    category_ids?: string[];
    attributes?: { attributes: Attribute[] };
    is_rateable?: boolean;
    is_returnable?: boolean;
}

export class ItemDto {
    id: string;
    name: string;
    product_set_reference: string;
    descriptor_name: string;
    descriptor_code?: string;
    descriptor_short_desc?: string;
    descriptor_long_desc?: string;
    descriptor_media: Array<MediaFile>;
    descriptor_images: string[];
    descriptor_additional_desc: DescriptorAdditionalDesc[];
    creator: string;
    price: number;
    price_currency: string;
    quantity: number;
    reorder_level: number;
    is_active: boolean;
    category_ids: string[];
    attributes: { attributes: Attribute[] };
    unit: string;
    is_rateable: boolean;
    is_returnable: boolean;
}

export const ViewItemSelects = {
    id: true,
    name: true,
    product_set_reference: true,
    descriptor_name: true,
    descriptor_code: true,
    descriptor_short_desc: true,
    descriptor_long_desc: true,
    descriptor_media: true,
    descriptor_images: true,
    descriptor_additional_desc: true,
    creator: true,
    price: true,
    price_currency: true,
    quantity: true,
    reorder_level: true,
    is_active: true,
    category_ids: true,
    attributes: true,
    unit: true,
    is_rateable: true,
    is_returnable: true,
};

export class EditableItemDto {
    id: string;
    is_active: boolean;
    price: number;
    quantity: number;
    reorder_level: number;
    name: string;
}
