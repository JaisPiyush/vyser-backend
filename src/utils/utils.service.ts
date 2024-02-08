import { Injectable } from '@nestjs/common';
import { GoogleCloudBuckets, GoogleCloudService } from 'src/shared/gc.service';

@Injectable()
export class UtilsService {
    constructor(private readonly googleCloudService: GoogleCloudService) {}

    private async __uploadImage(
        res: any,
        image: Express.Multer.File,
        bucketName?: string,
        name?: string,
    ) {
        name = name || `${Date.now()}`;
        await this.googleCloudService.uploadImageToStorage(
            res,
            image,
            name,
            bucketName,
        );
        // return {
        //     url: publicUrl,
        //     gcSchemaUri:
        //         this.googleCloudService.getGSSchemaUriForPublicUrl(publicUrl),
        // };
    }

    async uploadImageToStorage(image: Express.Multer.File, res: any) {
        return await this.__uploadImage(
            res,
            image,
            GoogleCloudBuckets.VYSER_STORAGE,
        );
    }

    async uploadImageToTemporaryBucket(image: Express.Multer.File, res) {
        return await this.__uploadImage(
            res,
            image,
            GoogleCloudBuckets.VYSER_TEMPORARY_IMAGE_BUCKET,
        );
    }

    async deleteImageFromStorage(gsSchemaUri: string) {
        return await this.googleCloudService.deleteImageFromStorage(
            gsSchemaUri,
        );
    }

    convertPublicUrlToGSSchemaUri(publicUrl: string) {
        return this.googleCloudService.getGSSchemaUriForPublicUrl(publicUrl);
    }

    convertGSSchemaUriToPublicUrl(gsSchemaUri: string) {
        return this.googleCloudService.getPublicUrlForGSSchemaUri(gsSchemaUri);
    }
}
