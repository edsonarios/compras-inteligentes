import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator'

export class UploadImageDto {
  @IsUUID()
  spaceId: string

  @IsString()
  @IsIn(['locations', 'purchases'])
  entityType: 'locations' | 'purchases'

  @IsOptional()
  @IsUUID()
  entityId?: string

  @IsOptional()
  @IsString()
  @MaxLength(160)
  fileNameStem?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  fileIndex?: number
}
