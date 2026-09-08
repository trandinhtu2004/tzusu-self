import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { PopulatedUserDocument } from '../../../users/entities/user.schema';
import { UsersService } from '../../../users/services/users.service';
import { LoginDto } from '../../dto/req/login.dto';
import { RegisterDto } from '../../dto/req/register.dto';
import type {
  AuthUserResponse,
  LoginResponse,
  RegisterResponse,
} from '../../interfaces/auth-response.interface';
import type { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { PasswordService } from '../password/password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const passwordHash = await this.passwordService.hash(dto.password);
    const user = await this.usersService.registerPendingAccount({
      email: dto.email,
      username: dto.username,
      passwordHash,
      displayName: dto.displayName,
    });

    return { user: this.toAuthUserResponse(user) };
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const email = dto.email.trim().toLowerCase();
    const authenticationUser =
      await this.usersService.findForAuthenticationByEmail(email);

    if (
      !authenticationUser ||
      !(await this.passwordService.verify(
        dto.password,
        authenticationUser.passwordHash,
      ))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (authenticationUser.status === 'pending') {
      throw new ForbiddenException('Account is awaiting admin approval');
    }

    if (authenticationUser.status === 'banned') {
      throw new ForbiddenException('Account has been banned');
    }

    const user = await this.usersService.findById(
      authenticationUser._id.toString(),
    );
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: this.toAuthUserResponse(user),
    };
  }

  getCurrentUser(user: PopulatedUserDocument): RegisterResponse {
    return { user: this.toAuthUserResponse(user) };
  }

  private toAuthUserResponse(user: PopulatedUserDocument): AuthUserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      ...(user.avatarUrl ? { avatarUrl: user.avatarUrl } : {}),
      status: user.status,
      role: user.role?.name ?? null,
      permissions: this.usersService.getEffectivePermissionNames(user),
    };
  }
}
