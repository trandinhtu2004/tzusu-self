import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsString()
  @Length(3, 30)
  @Matches(/^[a-zA-Z0-9_]+$/)
  username: string;

  @IsString()
  @Length(8, 128)
  password: string;

  @IsString()
  @Length(2, 80)
  displayName: string;
}
