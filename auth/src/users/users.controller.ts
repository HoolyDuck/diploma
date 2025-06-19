import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

import { UserDto } from './dto/user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @MessagePattern('users.getById')
  async getUserById(@Payload() { id }: { id: number }): Promise<UserDto> {
    return this.usersService.findById(id);
  }

  @MessagePattern('users.getManyByIds')
  async getUsersByIds(
    @Payload() { ids }: { ids: number[] },
  ): Promise<Omit<UserDto, 'password'>[]> {
    return this.usersService.findManyByIds(ids);
  }
}
