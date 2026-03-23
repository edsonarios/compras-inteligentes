import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'

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
}
