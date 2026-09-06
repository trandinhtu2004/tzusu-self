import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '../interfaces/user.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<any>,
  ) {}

  async findById(id: string): Promise<any | null> {
    try {
      return this.userModel
        .findById(id)
        .populate('role')
        .populate('grantedPermissions')
        .populate('deniedPermissions')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async findByEmail(email: string): Promise<any | null> {
    try {
      return this.userModel.findOne({ email }).populate('role').exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async findByUsername(username: string): Promise<any | null> {
    try {
      return this.userModel.findOne({ username }).populate('role').exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async createUser(user: any): Promise<any> {
    try {
      return this.userModel.create(user);
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async setRole(userId: string, roleId: string): Promise<any | null> {
    try {
      return this.userModel
        .findByIdAndUpdate(userId, { role: roleId }, { new: true })
        .populate('role')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async grantPermission(
    userId: string,
    permissionId: string,
  ): Promise<any | null> {
    try {
      return this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $addToSet: { grantedPermissions: permissionId },
            $pull: { deniedPermissions: permissionId },
          },
          { new: true },
        )
        .populate('grantedPermissions')
        .populate('deniedPermissions')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }

  async denyPermission(
    userId: string,
    permissionId: string,
  ): Promise<any | null> {
    try {
      return this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $addToSet: { deniedPermissions: permissionId },
            $pull: { grantedPermissions: permissionId },
          },
          { new: true },
        )
        .populate('grantedPermissions')
        .populate('deniedPermissions')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('server error: ' + error);
    }
  }
}
