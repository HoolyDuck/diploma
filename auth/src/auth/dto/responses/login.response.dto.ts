import { UserDto } from '../user.dto';

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}
