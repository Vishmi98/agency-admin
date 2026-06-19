import mongoose, { models } from "mongoose";

import { BaseUser, baseUserSchema } from "../user/baseUser.model";


export interface Staff extends BaseUser {
  title: number;
  nic: string;
  gender: number;
  isEmailVerify: boolean;
  isMobileVerify: boolean;
  eduction: number[] | [];
  experience: number[] | [];
  fullName: string;
  address: string;
  cvPath: string;
  cvPathId: string;
  branchId: number;
  isBasicSalaryPay: boolean;
  isAttendanceMatter: boolean;
  basicSalary: number;
  commissionAmount: number;
  isActive: boolean;
  createDate: Date;
  updatedDate: Date;
}

// Staff schema
const StaffSchema = new mongoose.Schema({
  ...baseUserSchema.obj,
  title: { type: Number, required: true },
  nic: { type: String },
  gender: { type: Number },
  isEmailVerify: { type: Boolean, default: false },
  isMobileVerify: { type: Boolean, default: false },
  isAttendanceMatter: { type: Boolean, default: false },
  isBasicSalaryPay: { type: Boolean, default: false },
  eduction: [{ type: Number }],
  experience: [{ type: Number }],
  branchId: { type: Number },
  fullName: { type: String, required: true },
  cvPath: { type: String, default: "0" },
  cvPathId: { type: String, default: "0" },
  address: { type: String },
  basicSalary: { type: Number, default: 0 },
  commissionAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

StaffSchema.index({ fullName: "text", email: "text", nic: "text", address: "text" });

StaffSchema.virtual("titleInfo", {
  ref: "Title",
  localField: "title",
  foreignField: "id",
  justOne: true,
});

StaffSchema.virtual("genderInfo", {
  ref: "Gender",
  localField: "gender",
  foreignField: "id",
  justOne: true,
});

StaffSchema.virtual("branchInfo", {
  ref: "Branch",
  localField: "branchId",
  foreignField: "id",
  justOne: true,
});

StaffSchema.set("toObject", { virtuals: true });
StaffSchema.set("toJSON", { virtuals: true });

const StaffModel = models.Staff || mongoose.model<Staff>("Staff", StaffSchema);

export default StaffModel;
