import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRoleRepository } from '../interfaces/role.interface';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectModel('Role')
    private readonly roleModel: Model<any>,
  ) {}

  async findAll(): Promise<any[]> {
    try {
      return this.roleModel
        .find()
        .populate('permissions')
        .sort({ name: 1 })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async findById(id: string): Promise<any | null> {
    try {
      return this.roleModel.findById(id).populate('permissions').exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async findByName(name: string): Promise<any | null> {
    try {
      return this.roleModel.findOne({ name }).populate('permissions').exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async createRole(role: any): Promise<any> {
    return this.roleModel.create(role);
  }

  async attachPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<any | null> {
    try {
      return this.roleModel
        .findByIdAndUpdate(
          roleId,
          { $addToSet: { permissions: { $each: permissionIds } } },
          { new: true },
        )
        .populate('permissions')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }
}
