import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findAll(): Promise<any[]> {
    return this.roleRepository.findAll();
  }

  async findById(id: string): Promise<any | null> {
    return this.roleRepository.findById(id);
  }

  async findByName(name: string): Promise<any | null> {
    return this.roleRepository.findByName(name);
  }

  async createRole(role: any): Promise<any> {
    return this.roleRepository.createRole(role);
  }

  async attachPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<any | null> {
    return this.roleRepository.attachPermissions(roleId, permissionIds);
  }
}
