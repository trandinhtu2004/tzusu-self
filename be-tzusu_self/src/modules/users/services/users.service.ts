import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<any | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<any | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByUsername(username: string): Promise<any | null> {
    return this.userRepository.findByUsername(username);
  }

  async createUser(user: any): Promise<any> {
    return this.userRepository.createUser(user);
  }

  async setRole(userId: string, roleId: string): Promise<any | null> {
    return this.userRepository.setRole(userId, roleId);
  }

  async grantPermission(
    userId: string,
    permissionId: string,
  ): Promise<any | null> {
    return this.userRepository.grantPermission(userId, permissionId);
  }

  async denyPermission(
    userId: string,
    permissionId: string,
  ): Promise<any | null> {
    return this.userRepository.denyPermission(userId, permissionId);
  }
}
