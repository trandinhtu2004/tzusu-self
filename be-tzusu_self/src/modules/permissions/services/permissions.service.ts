import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isDuplicateKeyError } from '../../../common/utils/mongo-error';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionDocument } from '../entities/permission.schema';
import { PermissionRepository } from '../repositories/permission.repository';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async getAllPermissions(): Promise<PermissionDocument[]> {
    return this.permissionRepository.findAll();
  }

  async findByName(name: string): Promise<PermissionDocument | null> {
    return this.permissionRepository.findByName(name);
  }

  async ensurePermissionIdsExist(ids: string[]): Promise<void> {
    const uniqueIds = [...new Set(ids)];
    const permissions = await this.permissionRepository.findByIds(uniqueIds);

    if (permissions.length !== uniqueIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }
  }

  async createPermission(
    permission: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    const existingPermission = await this.permissionRepository.findByName(
      permission.name,
    );

    if (existingPermission) {
      throw new ConflictException('Permission name already exists');
    }

    try {
      return await this.permissionRepository.createPermission(permission);
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException('Permission name already exists');
      }

      throw error;
    }
  }
}
