import mongoose, { Schema, Document } from 'mongoose';

export const PermissionSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false }
    
});
