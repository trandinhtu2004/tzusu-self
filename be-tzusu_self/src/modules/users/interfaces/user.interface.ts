export interface IUserRepository {
  findById(id: string): Promise<any | null>;
  findByEmail(email: string): Promise<any | null>;
  findByUsername(username: string): Promise<any | null>;
  createUser(user: any): Promise<any>;
  setRole(userId: string, roleId: string): Promise<any | null>;
  grantPermission(userId: string, permissionId: string): Promise<any | null>;
  denyPermission(userId: string, permissionId: string): Promise<any | null>;
}
