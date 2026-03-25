import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { UploadImageDto } from './dto/upload-image.dto'
import { UploadsService } from './uploads.service'

type UploadedImageFile = {
  buffer: Buffer
  mimetype: string
  originalname: string
}

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  uploadImage(
    @UploadedFile() file: UploadedImageFile | undefined,
    @Body() uploadImageDto: UploadImageDto,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required')
    }

    return this.uploadsService.uploadImage({
      file,
      spaceId: uploadImageDto.spaceId,
      entityType: uploadImageDto.entityType,
      entityId: uploadImageDto.entityId,
      fileNameStem: uploadImageDto.fileNameStem,
      fileIndex:
        uploadImageDto.fileIndex !== undefined
          ? Number(uploadImageDto.fileIndex)
          : undefined,
    })
  }
}
