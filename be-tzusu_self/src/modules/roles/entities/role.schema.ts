import mongoose, { HydratedDocument, Schema, Types } from 'mongoose';
import { PermissionDocument } from '../../permissions/entities/permission.schema';

export interface Role {
  name: string;
  description?: string;
  permissions: Types.ObjectId[];
}

export type RoleDocument = HydratedDocument<Role>;
export type PopulatedRoleDocument = Omit<RoleDocument, 'permissions'> & {
  permissions: PermissionDocument[];
};

export interface CreateRoleData {
  name: string;
  description?: string;
  permissions?: string[];
}

export const RoleSchema = new Schema<Role>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
});
