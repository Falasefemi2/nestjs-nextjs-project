import type { User } from '@prisma/client';

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: Omit<User, 'password'>;
}
