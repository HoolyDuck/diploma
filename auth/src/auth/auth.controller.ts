import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MessagePattern } from '@nestjs/microservices';
import { TokensDto } from './dto/tokens.dto';
import { RegisterResponseDto } from './dto/responses/register.response.dto';
import { LoginResponseDto } from './dto/responses/login.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern('auth.register')
  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto);
  }

  @MessagePattern('auth.login')
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @MessagePattern('auth.verifyToken')
  async verifyToken(token: string): Promise<{ userId: number }> {
    return this.authService.verifyAccessToken(token);
  }

  @MessagePattern('auth.refresh')
  async refresh(refreshToken: string): Promise<TokensDto> {
    return this.authService.refreshTokens(refreshToken);
  }
}
