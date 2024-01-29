import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from 'src/repositories/seller/seller.service';

@Module({
    controllers: [SellerController],
    providers: [SellerService],
})
export class SellerModule {}
