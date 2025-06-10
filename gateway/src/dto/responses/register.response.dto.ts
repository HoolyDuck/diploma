import { UserDto } from '../user.dto';

export class RegisterResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}
