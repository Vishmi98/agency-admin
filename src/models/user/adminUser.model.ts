import mongoose, { models } from 'mongoose';

import { BaseUser, baseUserSchema } from './baseUser.model';


export interface AdminUser extends BaseUser { }

const adminUserSchema = new mongoose.Schema(baseUserSchema.obj);

export const AdminUserModel_ = models.AdminUser || mongoose.model<AdminUser>('AdminUser', adminUserSchema);
