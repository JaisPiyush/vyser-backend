import { Column, Entity, PrimaryColumn } from 'typeorm';
import {
    MediaFile,
    DescriptorAdditionalDesc,
    Image,
    Attribute,
} from 'src/shared/types';

@Entity()
export class SellerEntity {
    @PrimaryColumn()
    id: string;

    @Column()
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
    @Column({ type: 'json', array: true })
    descriptor_media: Array<MediaFile>;
    @Column({ type: 'json', array: true })
    descriptor_images: Image[];
    @Column({ type: 'json', array: true })
    descriptor_additional_desc: DescriptorAdditionalDesc[];

    @Column({ type: 'jsonb', array: true })
    attributes: Attribute[];
}
