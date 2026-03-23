import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateLocationDto {
  @IsUUID()
  spaceId: string;

  @IsString()
  @MaxLength(160)
  name: string;

  @IsString()
  gps: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
