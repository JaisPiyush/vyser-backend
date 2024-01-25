import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { DescriptorEntity } from '../common/descriptor.entity';
import { Point } from 'geojson';

@Entity()
export class LocationEntity extends DescriptorEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    district: string;

    @Column()
    state: string;

    @Column()
    country: string;

    @Column()
    area_code: string;

    @Index({ spatial: true })
    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    })
    gps: Point;
}
