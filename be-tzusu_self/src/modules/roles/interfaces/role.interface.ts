export interface IRoleRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  findByName(name: string): Promise<any | null>;
  createRole(role: any): Promise<any>;
  attachPermissions(roleId: string, permissionIds: string[]): Promise<any | null>;
}
