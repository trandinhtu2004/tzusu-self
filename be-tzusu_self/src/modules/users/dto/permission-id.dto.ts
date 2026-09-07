import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class PermissionIdDto {
  @ApiProperty({
    example: '66f000000000000000000001',
  })
  @IsMongoId()
  permissionId: string;
}
