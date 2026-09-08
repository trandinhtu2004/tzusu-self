import { CreateUserData, PopulatedUserDocument } from '../entities/user.schema';
import {User} from '../entities/user.schema';
export interface IUserRepository {
  findById(id: string): Promise<PopulatedUserDocument | null>;
  findByEmail(email: string): Promise<PopulatedUserDocument | null>;
  findByUsername(username: string): Promise<PopulatedUserDocument | null>;
  getAllUsers(): Promise<PopulatedUserDocument[]>;
  createUser(user: CreateUserData): Promise<PopulatedUserDocument>;
  updateUser(
    id: string,
    user: CreateUserData,
  ): Promise<PopulatedUserDocument | null>;
  setRole(
    userId: string,
    roleId: string,
  ): Promise<PopulatedUserDocument | null>;
  grantPermission(
    userId: string,
    permissionId: string,
  ): Promise<PopulatedUserDocument | null>;
  denyPermission(
    userId: string,
    permissionId: string,
  ): Promise<PopulatedUserDocument | null>;
  findForAuthenticationByEmail(
  email: string,
): Promise<User | null>;
}
