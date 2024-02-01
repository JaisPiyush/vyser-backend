import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    Post,
    Put,
} from '@nestjs/common';
import {
    CreateSellerDto,
    UpdateSellerDto,
} from 'src/repositories/seller/seller.dto';
import { SellerEntity } from 'src/repositories/seller/seller.entity';
import { SellerService } from 'src/repositories/seller/seller.service';
import { User } from 'src/repositories/user/user.entity';
import { GetSeller, GetUser } from 'src/shared/decorators';

@Controller('seller')
export class SellerController {
    constructor(private sellerService: SellerService) {}

    @Post()
    @HttpCode(201)
    async create(
        @GetUser() user: User,
        @Body() createSellerDto: CreateSellerDto,
    ) {
        const seller = await this.sellerService.create(
            user.id,
            createSellerDto,
        );
        return seller;
    }

    @Get()
    async get(@GetUser() user: User) {
        const seller = await this.sellerService.get(user.id);
        if (!seller) {
            throw new HttpException('Seller not found', 404);
        }
        return seller;
    }
    @Put()
    async update(
        @GetSeller() seller: SellerEntity,
        @Body() updateSellerDto: UpdateSellerDto,
    ) {
        return await this.sellerService.update(seller, updateSellerDto);
    }
}
