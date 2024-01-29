import { Body, Controller, Get, HttpCode, Post, Put } from '@nestjs/common';
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
        return await this.sellerService.create(user.id, createSellerDto);
    }

    @Get()
    async get(@GetUser() user: User) {
        return await this.sellerService.get(user.id);
    }
    @Put()
    async update(
        @GetSeller() seller: SellerEntity,
        @Body() updateSellerDto: UpdateSellerDto,
    ) {
        await this.sellerService.update(seller, updateSellerDto);
    }
}
