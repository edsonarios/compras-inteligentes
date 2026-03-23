import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    return this.usersService.create(registerDto);
  }

  async login(loginDto: LoginDto) {
    const userWithPassword = await this.usersService.findByEmailWithPassword(loginDto.email);

    if (!userWithPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordsMatch = await bcrypt.compare(
      loginDto.password,
      userWithPassword.passwordHash,
    );

    if (!passwordsMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.usersService.toResponseDto(userWithPassword);
  }
}
