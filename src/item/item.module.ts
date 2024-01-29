import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from 'src/repositories/item/item.service';
import { ItemEntity } from 'src/repositories/item/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    controllers: [ItemController],
    providers: [ItemService],
    imports: [TypeOrmModule.forFeature([ItemEntity])],
})
export class ItemModule {}
