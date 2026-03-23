import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @MaxLength(120)
  name: string

  @IsString()
  @MinLength(8)
  @MaxLength(120)
  password: string
}
