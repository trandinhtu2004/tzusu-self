import { Injectable } from '@nestjs/common';
import { PermissionRepository } from '../repositories/permission.repository';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async getAllPermissions(): Promise<any[]> {
    return this.permissionRepository.findAll();
  }

  async findByName(name: string): Promise<any | null> {
    return this.permissionRepository.findByName(name);
  }

  async createPermission(permission: any): Promise<any> {
    return this.permissionRepository.createPermission(permission);
  }
}
