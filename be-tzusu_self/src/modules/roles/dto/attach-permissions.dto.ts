import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId } from 'class-validator';

export class AttachPermissionsDto {
  @ApiProperty({
    example: ['66f000000000000000000001'],
    description: 'Permission ids to attach to this role.',
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  permissionIds: string[];
}
