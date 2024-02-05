import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { SellerModule } from './seller/seller.module';
// import { ItemModule } from './item/item.module';
import { SearchModule } from './search/search.module';
import { User } from './repositories/user/user.entity';
import { SellerEntity } from './repositories/seller/seller.entity';
import { LocationEntity } from './repositories/location/location.entity';
import { AuthModule } from './auth/auth.module';
import { SellerModule } from './seller/seller.module';
import { ItemModule } from './item/item.module';
import { ItemEntity } from './repositories/item/item.entity';
// import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';
import { MessagesModule } from './messages/messages.module';
import { MessagesEntity } from './repositories/messages/messages.entity';
import { ProductSetEntity } from './repositories/product-set/product-set.entity';
import { ProductSetModule } from './product-set/product-set.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [
                    User,
                    SellerEntity,
                    LocationEntity,
                    ItemEntity,
                    MessagesEntity,
                ],
                synchronize: true,
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            name: 'supabase',
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('PRODUCT_DB_HOST'),
                port: configService.get('PRODUCT_DB_PORT'),
                username: configService.get('PRODUCT_DB_USERNAME'),
                password: configService.get('PRODUCT_DB_PASSWORD'),
                database: configService.get('PRODUCT_DB_NAME'),
                entities: [ProductSetEntity],
                synchronize: false,
            }),
        }),
        AuthModule,
        SellerModule,
        ItemModule,
        SearchModule,
        UtilsModule,
        MessagesModule,
        ProductSetModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
