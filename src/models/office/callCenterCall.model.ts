import { Schema, model, Document, models } from "mongoose";

interface CallCenterCall extends Document {
  id: number;
  name: string;
  phone: string;
  from: string;
  note: string;
  qualification: string;
  successPercentage: number;
  response: string;
  createBy: number;
  checkBy: number;
  createDate: Date;
  updatedDate: Date;
}

const CallCenterCallSchema = new Schema<CallCenterCall>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  from: { type: String, required: true },
  note: { type: String, required: false },
  qualification: { type: String, required: true },
  successPercentage: { type: Number, required: true },
  response: { type: String, required: false },
  createBy: { type: Number, default: 0 },
  checkBy: { type: Number, default: 0 },
  createDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

CallCenterCallSchema.virtual('creatorInfo', {
  ref: 'Staff',
  localField: 'createBy',
  foreignField: 'id',
  justOne: true,
});

CallCenterCallSchema.virtual('checkerInfo', {
  ref: 'Staff',
  localField: 'checkBy',
  foreignField: 'id',
  justOne: true,
});

CallCenterCallSchema.set("toObject", { virtuals: true });
CallCenterCallSchema.set("toJSON", { virtuals: true });

const CallCenterCallModel = models.CallCenterCall || model<CallCenterCall>("CallCenterCall", CallCenterCallSchema);

export default CallCenterCallModel;
