import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'chat:use',
    description: 'Unique permission key in resource:action format.',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z]+(?::[a-z]+)+$/, {
    message: 'name must use resource:action format, for example chat:use',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Allow user to use the chat feature.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
