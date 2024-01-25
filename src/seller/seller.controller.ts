import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateSellerDto } from 'src/repositories/seller/seller.dto';
import { SellerService } from 'src/repositories/seller/seller.service';
import { User } from 'src/repositories/user/user.entity';
import { GetUser } from 'src/shared/decorators';

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
}
