import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';
import { firstValueFrom } from 'rxjs';
import { Request, Response } from 'express';
import { LoginResponseDto } from './dto/responses/login.response.dto';
import { RegisterResponseDto } from './dto/responses/register.response.dto';
import { JwtGuard } from './guards/jwt.guard';
import { GetUser } from './decorators/get-user.decorator';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
  ) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, user } = await firstValueFrom(
      this.authServiceClient.send<RegisterResponseDto>(
        'auth.register',
        registerDto,
      ),
    );

    this.setupCookie(response, refreshToken);

    response.status(201).json({ accessToken, user });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    const { accessToken, refreshToken, user } = await firstValueFrom(
      this.authServiceClient.send<LoginResponseDto>('auth.login', loginDto),
    );

    this.setupCookie(response, refreshToken);

    response.status(200).json({ accessToken, user });
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async me(@GetUser() user: { id: number }) {
    const userData = await firstValueFrom(
      this.authServiceClient.send<UserDto>('users.getById', {
        id: user.id,
      }),
    );
    return userData;
  }

  @Get('refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    const refreshToken = request.cookies['refreshToken'];
    console.log('Request cookies:', request.cookies);
    console.log('Refresh token:', refreshToken);

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = await firstValueFrom(
      this.authServiceClient.send<TokensDto>('auth.refresh', refreshToken),
    ).catch(() => {
      throw new UnauthorizedException('Invalid refresh token');
    });

    this.setupCookie(response, newRefreshToken);
    response.status(200).json({ accessToken });
  }

  private setupCookie(
    res: Response,
    refreshToken: string,
    maxAge: number = 60 * 60 * 24 * 7 * 1000,
  ) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge,
    });
  }
}
