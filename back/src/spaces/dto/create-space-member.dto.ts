import { IsEmail, IsOptional, IsUUID } from 'class-validator'

export class CreateSpaceMemberDto {
  @IsEmail()
  email: string

  @IsOptional()
  @IsUUID()
  userId?: string
}
