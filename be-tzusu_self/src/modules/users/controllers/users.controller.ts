import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findById(@Param('id') id: string): Promise<any | null> {
    return this.usersService.findById(id);
  }

  @Post()
  createUser(@Body() user: any): Promise<any> {
    return this.usersService.createUser(user);
  }

  @Patch(':id/role')
  setRole(
    @Param('id') id: string,
    @Body('roleId') roleId: string,
  ): Promise<any | null> {
    return this.usersService.setRole(id, roleId);
  }

  @Patch(':id/permissions/grant')
  grantPermission(
    @Param('id') id: string,
    @Body('permissionId') permissionId: string,
  ): Promise<any | null> {
    return this.usersService.grantPermission(id, permissionId);
  }

  @Patch(':id/permissions/deny')
  denyPermission(
    @Param('id') id: string,
    @Body('permissionId') permissionId: string,
  ): Promise<any | null> {
    return this.usersService.denyPermission(id, permissionId);
  }
}
