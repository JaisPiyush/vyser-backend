import { Body, Controller, Post, UploadedFile } from '@nestjs/common';
import { UtilsService } from './utils.service';

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

    // @Delete('storage')
    // async deleteImageFromStorage(@Body('url') url: string) {
    //     return await this.utilService.deleteImageFromStorage(url);
    // }

    @Post('storage')
    async uploadFileToStorage(
        @Body('name') name: string,
        @Body('is_temp') isTemp: boolean = false,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (isTemp) {
            return {
                url: await this.utilService.uploadImageToTemporaryBucket(file),
            };
        }
        return { url: await this.utilService.uploadImageToStorage(file) };
    }
}
