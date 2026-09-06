export interface IPermissionRepository {
  findAll(): Promise<any[]>;
  findByName(name: string): Promise<any | null>;
  createPermission(permission: any): Promise<any>;
}
