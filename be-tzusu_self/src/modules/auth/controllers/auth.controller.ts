import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { PopulatedUserDocument } from '../../users/entities/user.schema';
import { CurrentUser } from '../decorators/current-user.decorator';
import { LoginDto } from '../dto/req/login.dto';
import { RegisterDto } from '../dto/req/register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import type {
  LoginResponse,
  RegisterResponse,
} from '../interfaces/auth-response.interface';
import { AuthService } from '../services/auth/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: PopulatedUserDocument): RegisterResponse {
    return this.authService.getCurrentUser(user);
  }
}
