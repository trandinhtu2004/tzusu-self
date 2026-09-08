import {
  CreatePermissionData,
  PermissionDocument,
} from '../entities/permission.schema';

export interface IPermissionRepository {
  findAll(): Promise<PermissionDocument[]>;
  findByName(name: string): Promise<PermissionDocument | null>;
  findByIds(ids: string[]): Promise<PermissionDocument[]>;
  createPermission(
    permission: CreatePermissionData,
  ): Promise<PermissionDocument>;
}
