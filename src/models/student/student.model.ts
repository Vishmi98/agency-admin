import mongoose, { Schema, Document, models } from 'mongoose';

// Student Interface extending BaseUser
export interface IStudent extends Document {
  id: number;
  title: number;
  firstName: string;
  lastName: string;
  fullName: string;
  passportNo: string;
  issueDate: string;
  expireDate: string;
  phone: string;
  visaIssueDate: string;
  visaExpireDate: string;
  email: string;
  address: string;
  nic: string;
  password: string;
  createdBy: number; 
  createDate: Date;
  updatedDate: Date;
  visaStatus: number;
  status: number;
  branchId: number;
}

const studentSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String, required: true },
  passportNo: { type: String, required: true, unique: true },
  issueDate: { type: String },
  expireDate: { type: String },
  phone: { type: String, },
  visaIssueDate: { type: String },
  visaExpireDate: { type: String },
  email: { type: String, lowercase: true, trim: true, required: true, unique: true },
  address: { type: String },
  nic: { type: String, },
  password: { type: String },
  createdBy: { type: Number, default: 1 },
  createDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  visaStatus: { type: Number, default: 100 },
  status: { type: Number, default: 100 },
  branchId: { type: Number, required: true }
});

studentSchema.virtual('titleInfo', {
  ref: 'Title',
  localField: 'title', 
  foreignField: 'id',  
  justOne: true,
});

studentSchema.virtual('statusInfo', {
  ref: 'StudentStatus',
  localField: 'status', 
  foreignField: 'id',  
  justOne: true,
});

studentSchema.virtual('visaStatusInfo', {
  ref: 'VistaStatus',
  localField: 'visaStatus', 
  foreignField: 'id',  
  justOne: true,
});

studentSchema.virtual('branchInfo', {
  ref: 'Branch',
  localField: 'branchId', 
  foreignField: 'id',  
  justOne: true,
});

studentSchema.set('toObject', { virtuals: true });
studentSchema.set('toJSON', { virtuals: true });

export const StudentModel = models.Student || mongoose.model<IStudent>('Student', studentSchema);
