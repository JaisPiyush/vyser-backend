import { Module } from '@nestjs/common';
import { UserService } from 'src/repositories/user/user.service';
import { AuthGuard } from './auth.guard';
import { SellerService } from 'src/repositories/seller/seller.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/repositories/user/user.entity';
import { LocationEntity } from 'src/repositories/location/location.entity';
import { SellerEntity } from 'src/repositories/seller/seller.entity';
import { LocationService } from 'src/repositories/location/location.service';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [TypeOrmModule.forFeature([User, LocationEntity, SellerEntity])],
    providers: [
        LocationService,
        UserService,
        SellerService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AuthModule {}
