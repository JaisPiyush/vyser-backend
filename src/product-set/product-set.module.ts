import { Module } from '@nestjs/common';
import { ProductSetController } from './product-set.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSetEntity } from 'src/repositories/product-set/product-set.entity';
import { ProductSetService } from 'src/repositories/product-set/product-set.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductSetEntity], 'supabase')],
    controllers: [ProductSetController],
    providers: [ProductSetService],
})
export class ProductSetModule {}
