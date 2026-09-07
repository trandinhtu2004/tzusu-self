import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongoIdPipe } from '../../../common/pipes/mongo-id.pipe';
import { AttachPermissionsDto } from '../dto/attach-permissions.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
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
  findById(@Param('id', MongoIdPipe) id: string): Promise<any | null> {
    return this.rolesService.findById(id);
  }

  @Post()
  createRole(@Body() role: CreateRoleDto): Promise<any> {
    return this.rolesService.createRole(role);
  }

  @Patch(':id/permissions')
  attachPermissions(
    @Param('id', MongoIdPipe) id: string,
    @Body() body: AttachPermissionsDto,
  ): Promise<any | null> {
    return this.rolesService.attachPermissions(id, body.permissionIds);
  }
}
