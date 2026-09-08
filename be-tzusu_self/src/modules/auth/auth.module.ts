import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { PasswordService } from './services/password/password.service';

@Module({
  providers: [AuthService, PasswordService]
})
export class AuthModule {
    
}
