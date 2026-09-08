import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionDocument } from '../entities/permission.schema';
import { PermissionService } from './../services/permissions.service';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  getAllPermissions(): Promise<PermissionDocument[]> {
    return this.permissionService.getAllPermissions();
  }

  @Post()
  createPermission(
    @Body() permission: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    return this.permissionService.createPermission(permission);
  }
}
