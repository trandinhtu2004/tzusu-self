import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionSchema } from './entities/permission.schema';
import { PermissionService } from './services/permissions.service';
import { PermissionController } from './controllers/permissions.controller';
import { PermissionRepository } from './repositories/permission.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Permission', schema: PermissionSchema }]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService],
})
export class PermissionsModule {}
