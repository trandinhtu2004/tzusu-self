import mongoose, { Schema } from 'mongoose';

export const RoleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
});
