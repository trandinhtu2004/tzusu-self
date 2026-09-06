import mongoose, { Schema } from 'mongoose';

export const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String, required: true },
    avatarUrl: { type: String, required: false },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null },
    status: {
      type: String,
      enum: ['active', 'pending', 'banned'],
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

