import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
// import * as sharp from 'sharp'
import sharp from 'sharp' // work in prod

type UploadedImageFile = {
  buffer: Buffer
  mimetype: string
  originalname: string
}

@Injectable()
export class UploadsService {
  private readonly bucketName: string
  private readonly publicBaseUrlView: string
  private readonly imageMaxWidth: number
  private readonly imageMaxHeight: number
  private readonly imageWebpQuality: number
  private readonly s3Client: S3Client

  constructor(private readonly configService: ConfigService) {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID', '')
    const uploadBaseUrl = this.configService
      .get<string>('R2_PUBLIC_BASE_URL', '')
      .replace(/\/$/, '')
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME', '')
    this.publicBaseUrlView = this.configService
      .get<string>('R2_PUBLIC_BASE_URL_VIEW', '')
      .replace(/\/$/, '')
    this.imageMaxWidth = this.configService.get<number>('IMAGE_MAX_WIDTH', 1600)
    this.imageMaxHeight = this.configService.get<number>(
      'IMAGE_MAX_HEIGHT',
      1600,
    )
    this.imageWebpQuality = this.configService.get<number>(
      'IMAGE_WEBP_QUALITY',
      80,
    )

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint:
        uploadBaseUrl || `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get<string>(
          'R2_SECRET_ACCESS_KEY',
          '',
        ),
      },
    })
  }

  async uploadImage(params: {
    file: UploadedImageFile
    spaceId: string
    entityType: 'locations' | 'purchases'
    entityId?: string
    fileNameStem?: string
  }) {
    const optimizedBuffer = await this.optimizeImage(params.file.buffer)
    const sanitizedStem = this.sanitizeFileNamePart(params.fileNameStem)
    const fileName = params.entityId
      ? `${sanitizedStem ? `${sanitizedStem}-` : ''}${params.entityId}.webp`
      : `${params.entityType}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 10)}.webp`
    const key = `ci/${params.spaceId}/${fileName}`

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: optimizedBuffer,
        ContentType: 'image/webp',
      }),
    )

    return {
      key,
      url: `${this.publicBaseUrlView}/${key}`,
    }
  }

  private optimizeImage(buffer: Buffer) {
    return sharp(buffer)
      .rotate()
      .resize({
        width: this.imageMaxWidth,
        height: this.imageMaxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: this.imageWebpQuality,
        effort: 4,
      })
      .toBuffer()
  }

  private sanitizeFileNamePart(value?: string) {
    if (!value) {
      return ''
    }

    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
  }
}
