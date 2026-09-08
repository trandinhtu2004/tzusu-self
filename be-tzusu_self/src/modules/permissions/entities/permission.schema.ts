import { HydratedDocument, Schema } from 'mongoose';

export interface Permission {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PermissionDocument = HydratedDocument<Permission>;

export interface CreatePermissionData {
  name: string;
  description?: string;
}

export const PermissionSchema = new Schema<Permission>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: false, default: '' },
  },
  { timestamps: true },
);
