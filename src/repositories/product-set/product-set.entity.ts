import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'products_duplicate' })
export class ProductSetEntity {
    @PrimaryColumn('varchar', { name: 'product-code' })
    id: string;
    @Column('timestamptz')
    created_at: Date;
    @Column('varchar')
    brand: string;
    @Column('varchar')
    name: string;
    @Column('jsonb')
    attributes: object;
    @Column('jsonb')
    units: object;
    @Column('text', { array: true })
    display_images: string[];
    @Column('text', { array: true })
    images: string[];
    @Column('jsonb')
    image_bounding_boxes: object;
    @Column()
    description: string;
    @Column('varchar', { array: true })
    categories: string[];
    @Column()
    is_item_group: boolean;
    @Column({ nullable: true })
    item_group_id: string;
    @Column()
    product_set_id: string;
    @Column()
    product_id: string;
}
