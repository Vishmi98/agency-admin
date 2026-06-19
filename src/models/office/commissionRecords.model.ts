import { Schema, model, Document, models } from "mongoose";

interface CommissionRecord extends Document {
  id: string;
  staffId: Number;
  commissionId: Number;
  invoiceId: Number;
  status: string; 
  createDate: Date;
  updatedDate: Date;
}

const CommissionRecordSchema = new Schema<CommissionRecord>({
  id: { type: String, required: true, unique: true },
  staffId: { type: Number, required: true, unique: true },
  commissionId: { type: Number, required: true },
  invoiceId: { type: Number, required: true },
  status: { type: String, required: true, default: "Pending" },
  createDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

const CommissionRecordModel = models.CommissionRecord || model<CommissionRecord>("CommissionRecord", CommissionRecordSchema);

export default CommissionRecordModel;
