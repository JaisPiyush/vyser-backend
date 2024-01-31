import { Injectable } from '@nestjs/common';
import { GoogleCloudBuckets, GoogleCloudService } from 'src/shared/gc.service';

@Injectable()
export class UtilsService {
    constructor(private readonly googleCloudService: GoogleCloudService) {}

    private async __uploadImage(
        image: Express.Multer.File,
        bucketName?: string,
        name?: string,
    ) {
        name = name || `${Date.now()}`;
        const publicUrl = await this.googleCloudService.uploadImageToStorage(
            image,
            name,
            bucketName,
        );
        return publicUrl;
    }

    async uploadImageToStorage(image: Express.Multer.File) {
        return await this.__uploadImage(
            image,
            GoogleCloudBuckets.VYSER_STORAGE,
        );
    }

    async uploadImageToTemporaryBucket(image: Express.Multer.File) {
        return await this.__uploadImage(
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
