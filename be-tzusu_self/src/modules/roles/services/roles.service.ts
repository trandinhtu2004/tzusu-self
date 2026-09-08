import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isDuplicateKeyError } from '../../../common/utils/mongo-error';
import { PermissionService } from '../../permissions/services/permissions.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { PopulatedRoleDocument } from '../entities/role.schema';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class RolesService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(): Promise<PopulatedRoleDocument[]> {
    return this.roleRepository.findAll();
  }

  async findById(id: string): Promise<PopulatedRoleDocument> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async findByName(name: string): Promise<PopulatedRoleDocument | null> {
    return this.roleRepository.findByName(name);
  }

  async createRole(role: CreateRoleDto): Promise<PopulatedRoleDocument> {
    const existingRole = await this.roleRepository.findByName(role.name);

    if (existingRole) {
      throw new ConflictException('Role name already exists');
    }

    if (role.permissions?.length) {
      await this.permissionService.ensurePermissionIdsExist(role.permissions);
    }

    try {
      return await this.roleRepository.createRole(role);
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException('Role name already exists');
      }

      throw error;
    }
  }

  async attachPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<PopulatedRoleDocument> {
    await this.findById(roleId);
    await this.permissionService.ensurePermissionIdsExist(permissionIds);

    const role = await this.roleRepository.attachPermissions(
      roleId,
      permissionIds,
    );

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }
}
