import mongoose, { HydratedDocument, Schema, Types } from 'mongoose';
import { PermissionDocument } from '../../permissions/entities/permission.schema';
import { PopulatedRoleDocument } from '../../roles/entities/role.schema';

export const USER_STATUSES = ['active', 'pending', 'banned'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export interface User {
  email: string;
  username: string;
  passwordHash: string;
  displayName: string;
  avatarUrl?: string;
  role: Types.ObjectId | null;
  status: UserStatus;
  grantedPermissions: Types.ObjectId[];
  deniedPermissions: Types.ObjectId[];
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export type PopulatedUserDocument = Omit<
  UserDocument,
  'role' | 'grantedPermissions' | 'deniedPermissions'
> & {
  role: PopulatedRoleDocument | null;
  grantedPermissions: PermissionDocument[];
  deniedPermissions: PermissionDocument[];
};

export interface CreateUserData {
  email: string;
  username: string;
  passwordHash: string;
  displayName: string;
  avatarUrl?: string;
  role?: string;
  status?: UserStatus;
  grantedPermissions?: string[];
  deniedPermissions?: string[];
}

export interface UserPersistenceData {
  email: string;
  username: string;
  passwordHash: string;
  displayName: string;
  avatarUrl?: string;
  role?: Types.ObjectId;
  status?: UserStatus;
  grantedPermissions?: Types.ObjectId[];
  deniedPermissions?: Types.ObjectId[];
}

export const UserSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String, required: true },
    avatarUrl: { type: String, required: false },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null },
    status: {
      type: String,
      enum: USER_STATUSES,
      default: 'pending',
    },
    grantedPermissions: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Permission' },
    ],
    deniedPermissions: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Permission' },
    ],
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);
