import { IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  spaceId: string;

  @IsString()
  @MaxLength(160)
  name: string;

  @IsString()
  @MaxLength(120)
  category: string;

  @IsString()
  description: string;
}
