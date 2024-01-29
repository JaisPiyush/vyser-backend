import { Module } from '@nestjs/common';
import { UserService } from 'src/repositories/user/user.service';
import { AuthGuard } from './auth.guard';
import { SellerService } from 'src/repositories/seller/seller.service';

@Module({
    providers: [UserService, SellerService, AuthGuard],
})
export class AuthModule {}
