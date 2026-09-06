import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(): Promise<any[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<any | null> {
    return this.rolesService.findById(id);
  }

  @Post()
  createRole(@Body() role: any): Promise<any> {
    return this.rolesService.createRole(role);
  }

  @Patch(':id/permissions')
  attachPermissions(
    @Param('id') id: string,
    @Body('permissionIds') permissionIds: string[],
  ): Promise<any | null> {
    return this.rolesService.attachPermissions(id, permissionIds);
  }
}
