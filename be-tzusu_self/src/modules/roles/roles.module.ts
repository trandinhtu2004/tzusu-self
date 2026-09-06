import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsModule } from '../permissions/permissions.module';
import { RoleSchema } from './entities/role.schema';
import { RolesController } from './controllers/roles.controller';
import { RoleRepository } from './repositories/role.repository';
import { RolesService } from './services/roles.service';

@Module({
  imports: [
    PermissionsModule,
    MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
  ],
  controllers: [RolesController],
  providers: [RolesService, RoleRepository],
  exports: [RolesService],
})
export class RolesModule {}
