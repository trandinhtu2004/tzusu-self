import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isDuplicateKeyError } from '../../../common/utils/mongo-error';
import { PermissionService } from '../../permissions/services/permissions.service';
import { RolesService } from '../../roles/services/roles.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { PopulatedUserDocument } from '../entities/user.schema';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rolesService: RolesService,
    private readonly permissionService: PermissionService,
  ) {}

  async findById(id: string): Promise<PopulatedUserDocument> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<PopulatedUserDocument | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByUsername(
    username: string,
  ): Promise<PopulatedUserDocument | null> {
    return this.userRepository.findByUsername(username);
  }

  async getAllUsers(): Promise<PopulatedUserDocument[]> {
    return this.userRepository.getAllUsers();
  }

  async createUser(user: CreateUserDto): Promise<PopulatedUserDocument> {
    const existingEmail = await this.userRepository.findByEmail(user.email);

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUsername = await this.userRepository.findByUsername(
      user.username,
    );

    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    if (user.role) {
      await this.rolesService.findById(user.role);
    }

    await this.ensureUserPermissionsExist(user);
    this.ensureNoPermissionOverlap(user);

    try {
      return await this.userRepository.createUser(user);
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException('Email or username already exists');
      }

      throw error;
    }
  }

  async setRole(
    userId: string,
    roleId: string,
  ): Promise<PopulatedUserDocument> {
    await this.findById(userId);
    await this.rolesService.findById(roleId);

    const user = await this.userRepository.setRole(userId, roleId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(
    userId: string,
    user: CreateUserDto,
  ): Promise<PopulatedUserDocument> {
    const updatedUser = await this.userRepository.updateUser(userId, user);

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async grantPermission(
    userId: string,
    permissionId: string,
  ): Promise<PopulatedUserDocument> {
    await this.findById(userId);
    await this.permissionService.ensurePermissionIdsExist([permissionId]);

    const user = await this.userRepository.grantPermission(
      userId,
      permissionId,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async denyPermission(
    userId: string,
    permissionId: string,
  ): Promise<PopulatedUserDocument> {
    await this.findById(userId);
    await this.permissionService.ensurePermissionIdsExist([permissionId]);

    const user = await this.userRepository.denyPermission(userId, permissionId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async ensureUserPermissionsExist(user: CreateUserDto): Promise<void> {
    const permissionIds = [
      ...(user.grantedPermissions ?? []),
      ...(user.deniedPermissions ?? []),
    ];

    if (permissionIds.length) {
      await this.permissionService.ensurePermissionIdsExist(permissionIds);
    }
  }

  private ensureNoPermissionOverlap(user: CreateUserDto): void {
    const grantedPermissions = new Set(user.grantedPermissions ?? []);
    const deniedPermissions = user.deniedPermissions ?? [];

    const hasOverlap = deniedPermissions.some((permissionId: string) =>
      grantedPermissions.has(permissionId),
    );

    if (hasOverlap) {
      throw new ConflictException(
        'Permission cannot be both granted and denied',
      );
    }
  }

  getEffectivePermissionNames(user: PopulatedUserDocument): string[] {
    if (user.status !== 'active') {
      return [];
    }

    const deniedPermissionNames = new Set(
      user.deniedPermissions.map((permission) => permission.name),
    );
    const allowedPermissionNames = [
      ...(user.role?.permissions ?? []),
      ...user.grantedPermissions,
    ].map((permission) => permission.name);

    return [...new Set(allowedPermissionNames)].filter(
      (permissionName) => !deniedPermissionNames.has(permissionName),
    );
  }

  hasPermission(user: PopulatedUserDocument, permissionName: string): boolean {
    return this.getEffectivePermissionNames(user).includes(permissionName);
  }
}
