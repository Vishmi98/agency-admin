import { Schema, Document } from 'mongoose';

export interface BaseUser extends Document {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    isVerify: boolean;
    authProvider: string;
    googleId?: string;
    facebookId?: string;
    email: string;
    mobileNumber?: string;
    dob?: string;
    isPublish: boolean;
    district?: number;
    city?: number;
    subCity?: number;
    educationLevel?: number;
    avatarPath?: string;
    updateAvatarPath?: string;
    avatarFileId?: string;
    updateAvatarFileId?: string;
    roll: number;
}

export const baseUserSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    isVerify: { type: Boolean, default: false },
    authProvider: { type: String, required: true },
    googleId: { type: String },
    facebookId: { type: String },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String },
    dob: { type: String },
    isPublish: { type: Boolean },
    district: { type: Number },
    roll: { type: Number },
    city: { type: Number },
    subCity: { type: Number },
    educationLevel: { type: Number },
    avatarPath: { type: String },
    updateAvatarPath: { type: String },
    avatarFileId: { type: String },
    updateAvatarFileId: { type: String },
    coverImage: { type: String },
});
