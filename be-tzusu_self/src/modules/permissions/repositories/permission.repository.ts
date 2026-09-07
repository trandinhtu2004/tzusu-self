import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPermissionRepository } from '../interfaces/permission.interface';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(
    @InjectModel('Permission')
    private readonly permissionModel: Model<any>,
  ) {}

  async findAll(): Promise<any[]> {
    try {
      return this.permissionModel.find().sort({ name: 1 }).exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async findByName(name: string): Promise<any | null> {
    try {
      return this.permissionModel.findOne({ name }).exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async findByIds(ids: string[]): Promise<any[]> {
    try {
      return this.permissionModel.find({ _id: { $in: ids } }).exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async createPermission(permission: any): Promise<any> {
    return this.permissionModel.create(permission);
  }
}
