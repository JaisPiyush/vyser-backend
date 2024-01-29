import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from 'src/repositories/seller/seller.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from 'src/repositories/location/location.entity';
import { SellerEntity } from 'src/repositories/seller/seller.entity';

@Module({
    controllers: [SellerController],
    providers: [SellerService],
    imports: [TypeOrmModule.forFeature([LocationEntity, SellerEntity])],
})
export class SellerModule {}
