import type {
	Uploader,
	UploadParams,
} from '@/domain/forum/application/storage/uploader'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { EnvService } from '../env/env.service'

@Injectable()
export class R2Storage implements Uploader {
	private client: S3Client

	constructor(private envService: EnvService) {
		const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')
		const bucketName = envService.get('AWS_BUCKET_NAME')
		const accessKeyId = envService.get('AWS_ACCESS_KEY_ID')
		const secretAccessKey = envService.get('AWS_SECRET_KEY_ID')

		this.client = new S3Client({
			endpoint: `https://${accountId}.r2.cloudflarestorage.com/${bucketName}`,
			region: 'auto',
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
		})
	}
	async upload({
		fileName,
		fileType,
		body,
	}: UploadParams): Promise<{ url: string }> {
		const uploadId = randomUUID()

		const uniqueFileName = `${uploadId}-${fileName}`

		await this.client.send(
			new PutObjectCommand({
				Bucket: this.envService.get('AWS_BUCKET_NAME'),
				Key: uniqueFileName,
				ContentDisposition: fileType,
				Body: body,
			}),
		)

		return {
			url: uniqueFileName,
		}
	}
}
