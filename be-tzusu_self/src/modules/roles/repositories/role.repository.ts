import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PermissionDocument } from '../../permissions/entities/permission.schema';
import {
  CreateRoleData,
  PopulatedRoleDocument,
  Role,
} from '../entities/role.schema';
import { IRoleRepository } from '../interfaces/role.interface';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectModel('Role')
    private readonly roleModel: Model<Role>,
  ) {}

  async findAll(): Promise<PopulatedRoleDocument[]> {
    try {
      return this.roleModel
        .find()
        .populate<{ permissions: PermissionDocument[] }>('permissions')
        .sort({ name: 1 })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async findById(id: string): Promise<PopulatedRoleDocument | null> {
    try {
      return this.roleModel
        .findById(id)
        .populate<{ permissions: PermissionDocument[] }>('permissions')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async findByName(name: string): Promise<PopulatedRoleDocument | null> {
    try {
      return this.roleModel
        .findOne({ name })
        .populate<{ permissions: PermissionDocument[] }>('permissions')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async createRole(role: CreateRoleData): Promise<PopulatedRoleDocument> {
    const createdRole = await this.roleModel.create({
      ...role,
      permissions: (role.permissions ?? []).map(
        (permissionId) => new Types.ObjectId(permissionId),
      ),
    });

    return createdRole.populate<{ permissions: PermissionDocument[] }>(
      'permissions',
    );
  }

  async attachPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<PopulatedRoleDocument | null> {
    try {
      return this.roleModel
        .findByIdAndUpdate(
          roleId,
          { $addToSet: { permissions: { $each: permissionIds } } },
          { new: true },
        )
        .populate<{ permissions: PermissionDocument[] }>('permissions')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }
}
