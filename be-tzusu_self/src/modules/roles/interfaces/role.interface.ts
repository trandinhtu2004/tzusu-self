import { CreateRoleData, PopulatedRoleDocument } from '../entities/role.schema';

export interface IRoleRepository {
  findAll(): Promise<PopulatedRoleDocument[]>;
  findById(id: string): Promise<PopulatedRoleDocument | null>;
  findByName(name: string): Promise<PopulatedRoleDocument | null>;
  createRole(role: CreateRoleData): Promise<PopulatedRoleDocument>;
  attachPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<PopulatedRoleDocument | null>;
}
