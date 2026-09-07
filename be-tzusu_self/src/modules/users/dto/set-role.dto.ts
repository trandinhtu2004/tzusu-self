import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class SetRoleDto {
  @ApiProperty({
    example: '66f000000000000000000001',
  })
  @IsMongoId()
  roleId: string;
}
