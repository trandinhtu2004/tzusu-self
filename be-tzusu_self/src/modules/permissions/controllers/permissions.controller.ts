import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionService } from './../services/permissions.service';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  getAllPermissions(): Promise<any[]> {
    return this.permissionService.getAllPermissions();
  }

  @Post()
  createPermission(@Body() permission: any): Promise<any> {
    return this.permissionService.createPermission(permission);
  }
}
