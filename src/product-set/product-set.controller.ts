import { Body, Controller, Post } from '@nestjs/common';
import { ProductSetService } from 'src/repositories/product-set/product-set.service';

@Controller('product-set')
export class ProductSetController {
    constructor(private readonly productSetService: ProductSetService) {}

    @Post('ids')
    async getProductsByIds(@Body('id') ids: string[]) {
        return this.productSetService.getProductsByIds(ids);
    }

    @Post('references')
    async getProductByReferences(@Body('references') references: string[]) {
        return this.productSetService.getProductByReferences(references);
    }
}
