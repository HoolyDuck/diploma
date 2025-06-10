import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers['authorization']?.split(' ')[1];

    const { userId } = await firstValueFrom(
      this.authServiceClient.send<{ userId: number }>(
        'auth.verifyToken',
        token,
      ),
    ).catch(() => {
      throw new UnauthorizedException('Invalid token');
    });

    const user = await firstValueFrom<UserDto>(
      this.authServiceClient.send('users.getById', { id: userId }),
    );
    request.user = user;
    return true;
  }
}
