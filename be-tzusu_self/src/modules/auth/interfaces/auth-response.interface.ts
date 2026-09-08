import type { UserStatus } from '../../users/entities/user.schema';

export interface AuthUserResponse {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  status: UserStatus;
  role: string | null;
  permissions: string[];
}

export interface RegisterResponse {
  user: AuthUserResponse;
}

export interface LoginResponse extends RegisterResponse {
  accessToken: string;
}
