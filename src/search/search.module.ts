import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from 'src/repositories/item/item.entity';
import { GoogleCloudService } from 'src/shared/gc.service';

@Module({
    controllers: [SearchController],
    providers: [GoogleCloudService, SearchService],
    imports: [TypeOrmModule.forFeature([ItemEntity])],
})
export class SearchModule {}
