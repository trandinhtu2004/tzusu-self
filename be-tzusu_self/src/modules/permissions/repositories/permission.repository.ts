import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreatePermissionData,
  Permission,
  PermissionDocument,
} from '../entities/permission.schema';
import { IPermissionRepository } from '../interfaces/permission.interface';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(
    @InjectModel('Permission')
    private readonly permissionModel: Model<Permission>,
  ) {}

  async findAll(): Promise<PermissionDocument[]> {
    try {
      return this.permissionModel.find().sort({ name: 1 }).exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async findByName(name: string): Promise<PermissionDocument | null> {
    try {
      return this.permissionModel.findOne({ name }).exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async findByIds(ids: string[]): Promise<PermissionDocument[]> {
    try {
      return this.permissionModel.find({ _id: { $in: ids } }).exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async createPermission(
    permission: CreatePermissionData,
  ): Promise<PermissionDocument> {
    return this.permissionModel.create(permission);
  }
}
