import { Transform } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreatePurchaseDto {
  @IsUUID()
  spaceId: string;

  @IsUUID()
  productId: string;

  @IsUUID()
  locationId: string;

  @Transform(({ value }) => Number(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @Transform(({ value }) => Number(value))
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  quantity: number;

  @IsDateString()
  date: string;

  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
