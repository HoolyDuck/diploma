import type { User } from "../user.type";

export type LoginResponse = {
  accessToken: string;
  user: User;
};
