export interface IPermissionRepository {
  findAll(): Promise<any[]>;
  findByName(name: string): Promise<any | null>;
  findByIds(ids: string[]): Promise<any[]>;
  createPermission(permission: any): Promise<any>;
}
