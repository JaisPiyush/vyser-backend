import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ProductSetService } from 'src/repositories/product-set/product-set.service';

@Controller('product-set')
export class ProductSetController {
    constructor(private readonly productSetService: ProductSetService) {}

    @Post('ids')
    @HttpCode(200)
    async getProductsByIds(@Body('id') ids: string[]) {
        return this.productSetService.getProductsByIds(ids);
    }

    @Post('references')
    @HttpCode(200)
    async getProductByReferences(@Body('references') references: string[]) {
        return this.productSetService.getProductByReferences(references);
    }
}
