import {
    Column,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SellerEntity } from '../seller/seller.entity';
import {
    MediaFile,
    DescriptorAdditionalDesc,
    Image,
    Attribute,
} from 'src/shared/types';

@Entity()
export class ItemEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(() => SellerEntity, (seller) => seller.items)
    seller: SellerEntity;
    @Column()
    name: string;
    @Index({ fulltext: true })
    @Column({ type: 'tsvector' })
    name_tsv: string;
    @Column()
    product_set_reference: string;
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
    @Index()
    @Column()
    creator: string;
    @Column()
    price: number;
    @Column({ default: 'INR' })
    price_currency: string;
    @Column({ default: 0 })
    quantity: number;
    @Column({ default: 0 })
    reorder_level: number;
    @Column({ default: true })
    is_active: boolean;
    @Column({ array: true })
    category_ids: string[];
    @Column({ type: 'jsonb', array: true })
    attributes: Attribute[];
    @Column()
    unit: string;
    @Column({ default: true })
    is_rateable: boolean;
    @Column({ default: true })
    is_returnable: boolean;
}
