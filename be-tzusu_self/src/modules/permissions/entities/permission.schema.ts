import { Schema } from 'mongoose';

export const PermissionSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: false, default: '' },
  },
  { timestamps: true },
);
