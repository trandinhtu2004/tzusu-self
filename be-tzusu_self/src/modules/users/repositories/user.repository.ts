import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PermissionDocument } from '../../permissions/entities/permission.schema';
import { PopulatedRoleDocument } from '../../roles/entities/role.schema';
import {
  CreateUserData,
  PopulatedUserDocument,
  User,
  UserDocument,
  UserPersistenceData,
} from '../entities/user.schema';
import { IUserRepository } from '../interfaces/user.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}

  async findById(id: string): Promise<PopulatedUserDocument | null> {
    try {
      return await this.userModel
        .findById(id)
        .populate<{ role: PopulatedRoleDocument | null }>({
          path: 'role',
          populate: {
            path: 'permissions',
            model: 'Permission',
          },
        })
        .populate<{ grantedPermissions: PermissionDocument[] }>(
          'grantedPermissions',
        )
        .populate<{ deniedPermissions: PermissionDocument[] }>(
          'deniedPermissions',
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async findByEmail(email: string): Promise<PopulatedUserDocument | null> {
    try {
      return await this.userModel
        .findOne({ email })
        .populate<{ role: PopulatedRoleDocument | null }>({
          path: 'role',
          populate: {
            path: 'permissions',
            model: 'Permission',
          },
        })
        .populate<{ grantedPermissions: PermissionDocument[] }>(
          'grantedPermissions',
        )
        .populate<{ deniedPermissions: PermissionDocument[] }>(
          'deniedPermissions',
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async findByUsername(
    username: string,
  ): Promise<PopulatedUserDocument | null> {
    try {
      return await this.userModel
        .findOne({ username })
        .populate<{ role: PopulatedRoleDocument | null }>({
          path: 'role',
          populate: {
            path: 'permissions',
            model: 'Permission',
          },
        })
        .populate<{ grantedPermissions: PermissionDocument[] }>(
          'grantedPermissions',
        )
        .populate<{ deniedPermissions: PermissionDocument[] }>(
          'deniedPermissions',
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async getAllUsers(): Promise<PopulatedUserDocument[]> {
    try {
      return await this.userModel
        .find()
        .populate<{ role: PopulatedRoleDocument | null }>({
          path: 'role',
          populate: {
            path: 'permissions',
            model: 'Permission',
          },
        })
        .populate<{ grantedPermissions: PermissionDocument[] }>(
          'grantedPermissions',
        )
        .populate<{ deniedPermissions: PermissionDocument[] }>(
          'deniedPermissions',
        )
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async createUser(user: CreateUserData): Promise<PopulatedUserDocument> {
    const createdUser = await this.userModel.create(
      this.toPersistenceData(user),
    );

    return this.populateUser(createdUser._id.toString());
  }

  async updateUser(
    id: string,
    user: CreateUserData,
  ): Promise<PopulatedUserDocument | null> {
    return await this.userModel
      .findByIdAndUpdate(id, this.toPersistenceData(user), { new: true })
      .populate<{ role: PopulatedRoleDocument | null }>({
        path: 'role',
        populate: {
          path: 'permissions',
          model: 'Permission',
        },
      })
      .populate<{ grantedPermissions: PermissionDocument[] }>(
        'grantedPermissions',
      )
      .populate<{ deniedPermissions: PermissionDocument[] }>(
        'deniedPermissions',
      )
      .exec();
  }

  async setRole(
    userId: string,
    roleId: string,
  ): Promise<PopulatedUserDocument | null> {
    try {
      return await this.userModel
        .findByIdAndUpdate(userId, { role: roleId }, { new: true })
        .populate<{ role: PopulatedRoleDocument | null }>({
          path: 'role',
          populate: {
            path: 'permissions',
            model: 'Permission',
          },
        })
        .populate<{ grantedPermissions: PermissionDocument[] }>(
          'grantedPermissions',
        )
        .populate<{ deniedPermissions: PermissionDocument[] }>(
          'deniedPermissions',
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async grantPermission(
    userId: string,
    permissionId: string,
  ): Promise<PopulatedUserDocument | null> {
    try {
      return await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $addToSet: { grantedPermissions: permissionId },
            $pull: { deniedPermissions: permissionId },
          },
          { new: true },
        )
        .populate<{ role: PopulatedRoleDocument | null }>({
          path: 'role',
          populate: {
            path: 'permissions',
            model: 'Permission',
          },
        })
        .populate<{ grantedPermissions: PermissionDocument[] }>(
          'grantedPermissions',
        )
        .populate<{ deniedPermissions: PermissionDocument[] }>(
          'deniedPermissions',
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async denyPermission(
    userId: string,
    permissionId: string,
  ): Promise<PopulatedUserDocument | null> {
    try {
      return await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $addToSet: { deniedPermissions: permissionId },
            $pull: { grantedPermissions: permissionId },
          },
          { new: true },
        )
        .populate<{ role: PopulatedRoleDocument | null }>({
          path: 'role',
          populate: {
            path: 'permissions',
            model: 'Permission',
          },
        })
        .populate<{ grantedPermissions: PermissionDocument[] }>(
          'grantedPermissions',
        )
        .populate<{ deniedPermissions: PermissionDocument[] }>(
          'deniedPermissions',
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  private async populateUser(id: string): Promise<PopulatedUserDocument> {
    const user = await this.findById(id);

    if (!user) {
      throw new InternalServerErrorException(
        'User was created but could not be loaded',
      );
    }

    return user;
  }

  private toPersistenceData(user: CreateUserData): UserPersistenceData {
    const { role, grantedPermissions, deniedPermissions, ...fields } = user;

    return {
      ...fields,
      ...(role !== undefined ? { role: new Types.ObjectId(role) } : {}),
      ...(grantedPermissions !== undefined
        ? {
            grantedPermissions: grantedPermissions.map(
              (permissionId) => new Types.ObjectId(permissionId),
            ),
          }
        : {}),
      ...(deniedPermissions !== undefined
        ? {
            deniedPermissions: deniedPermissions.map(
              (permissionId) => new Types.ObjectId(permissionId),
            ),
          }
        : {}),
    };
  }

  async findForAuthenticationByEmail(
    email: string,
  ): Promise<UserDocument | null> {
    try {
      return this.userModel.findOne({ email }).select('+passwordHash').exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }
}
