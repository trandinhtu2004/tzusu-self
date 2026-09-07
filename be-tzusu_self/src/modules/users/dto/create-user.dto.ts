import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'tzusu_reader',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'hashed_password_value',
    description: 'Temporary field until AuthModule owns password hashing.',
  })
  @IsString()
  @MinLength(8)
  passwordHash: string;

  @ApiProperty({
    example: 'Tzusu Reader',
  })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({
    example: '66f000000000000000000001',
  })
  @IsOptional()
  @IsMongoId()
  role?: string;

  @ApiPropertyOptional({
    example: 'pending',
    enum: ['active', 'pending', 'banned'],
  })
  @IsOptional()
  @IsEnum(['active', 'pending', 'banned'])
  status?: 'active' | 'pending' | 'banned';

  @ApiPropertyOptional({
    example: ['66f000000000000000000002'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  grantedPermissions?: string[];

  @ApiPropertyOptional({
    example: ['66f000000000000000000003'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  deniedPermissions?: string[];
}
