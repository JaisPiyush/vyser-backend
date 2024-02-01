import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { UtilsService } from './utils.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('utils')
export class UtilsController {
    constructor(private readonly utilService: UtilsService) {}

    @Post('storageUrlFormat')
    async getStorageUrlFormat(
        @Body('url') url: string,
        @Body('type') type: 'publicUrl' | 'gsSchemaUri',
    ) {
        if (type === 'publicUrl') {
            return { url: this.utilService.convertGSSchemaUriToPublicUrl(url) };
        }
        return { url: this.utilService.convertPublicUrlToGSSchemaUri(url) };
    }

    @Post('storage')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFileToStorage(@UploadedFile() file: Express.Multer.File) {
        return { url: await this.utilService.uploadImageToStorage(file) };
    }

    @Post('storage/temp')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFileToTempStorage(@UploadedFile() file: Express.Multer.File) {
        return {
            url: await this.utilService.uploadImageToTemporaryBucket(file),
        };
    }
}
