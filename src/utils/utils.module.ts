import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';
import { GoogleCloudService } from 'src/shared/gc.service';

@Module({
    controllers: [UtilsController],
    providers: [GoogleCloudService, UtilsService],
})
export class UtilsModule {}
