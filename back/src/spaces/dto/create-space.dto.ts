import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateSpaceMemberDto } from './create-space-member.dto';

export class CreateSpaceDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsUUID()
  ownerId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSpaceMemberDto)
  members?: CreateSpaceMemberDto[];
}
