import { DescriptorAdditionalDesc, Image, MediaFile } from 'src/shared/types';
import { Column } from 'typeorm';

export abstract class DescriptorEntity {
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
}
