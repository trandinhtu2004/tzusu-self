import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongoIdPipe } from '../../../common/pipes/mongo-id.pipe';
import { CreateUserDto } from '../dto/create-user.dto';
import { PermissionIdDto } from '../dto/permission-id.dto';
import { SetRoleDto } from '../dto/set-role.dto';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findById(@Param('id', MongoIdPipe) id: string): Promise<any | null> {
    return this.usersService.findById(id);
  }

  @Post()
  createUser(@Body() user: CreateUserDto): Promise<any> {
    return this.usersService.createUser(user);
  }

  @Get()
  getAllUsers(): Promise<any[]> {
    return this.usersService.getAllUsers();
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string): Promise<any | null> {
    return this.usersService.findByEmail(email);
  }

  @Patch(':id')
  updateUser(
    @Param('id', MongoIdPipe) id: string,
    @Body() user: CreateUserDto,
  ): Promise<any | null> {
    return this.usersService.updateUser(id, user);
  }

  @Patch(':id/role')
  setRole(
    @Param('id', MongoIdPipe) id: string,
    @Body() body: SetRoleDto,
  ): Promise<any | null> {
    return this.usersService.setRole(id, body.roleId);
  }

  @Patch(':id/permissions/grant')
  grantPermission(
    @Param('id', MongoIdPipe) id: string,
    @Body() body: PermissionIdDto,
  ): Promise<any | null> {
    return this.usersService.grantPermission(id, body.permissionId);
  }

  @Patch(':id/permissions/deny')
  denyPermission(
    @Param('id', MongoIdPipe) id: string,
    @Body() body: PermissionIdDto,
  ): Promise<any | null> {
    return this.usersService.denyPermission(id, body.permissionId);
  }
}
