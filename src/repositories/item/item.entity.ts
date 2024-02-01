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
    @Column({
        type: 'tsvector',
        transformer: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            from: (value: string) => `to_tsvector('english', :text)`,
            to: (value: string) => value,
        },
    })
    name_tsv: string;
    @Index()
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
    @Column({ type: 'varchar', array: true, default: [] })
    category_ids: string[];
    @Column({ type: 'text', array: true })
    attributes: Attribute[];
    @Column()
    unit: string;
    @Column({ default: true })
    is_rateable: boolean;
    @Column({ default: true })
    is_returnable: boolean;
}
