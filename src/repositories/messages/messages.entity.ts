import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MessagesEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('jsonb')
    message: Record<string, any>;
    @Column('timestamp', { default: new Date(Date.now()) })
    created_at: Date;
    @Index()
    @Column('varchar')
    sender: string;
    @Index()
    @Column('varchar')
    receiver: string;
}
