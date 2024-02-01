import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import {
    MediaFile,
    DescriptorAdditionalDesc,
    Image,
    Attribute,
} from 'src/shared/types';
import { LocationEntity } from '../location/location.entity';
import { ItemEntity } from '../item/item.entity';

@Entity()
export class SellerEntity {
    @PrimaryColumn()
    id: string;

    @Column({ default: 'local-retail' })
    category_id: string;

    @Column({ default: true })
    is_store_active: boolean;

    @Column({ unique: true })
    uid: string;

    // Descriptor
    @Column()
    descriptor_name: string;
    @Column()
    descriptor_code?: string;
    @Column()
    descriptor_short_desc?: string;
    @Column()
    descriptor_long_desc?: string;
    @Column({
        type: 'text',
        array: true,
        default: [],
    })
    descriptor_media: Array<MediaFile>;
    @Column({
        type: 'text',
        array: true,
        default: [],
        transformer: {
            from: (value: string) => JSON.parse(value),
            to: (value) => value,
        },
    })
    descriptor_images: Image[];
    @Column({
        type: 'text',
        array: true,
        default: [],
    })
    descriptor_additional_desc: DescriptorAdditionalDesc[];

    @Column({
        type: 'text',
        array: true,
        default: [],
        transformer: {
            from: (value: string) => JSON.parse(value),
            to: (value) => value,
        },
    })
    attributes: Attribute[];

    @OneToMany(() => LocationEntity, (location) => location.seller)
    locations: LocationEntity[];

    @OneToMany(() => ItemEntity, (item) => item.seller)
    items: ItemEntity[];
}
