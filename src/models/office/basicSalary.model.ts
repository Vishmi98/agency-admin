import { Schema, model, Document, models } from "mongoose";

interface BasicSalary extends Document {
  id: Number;
  role: Number;
  amount: Number;
  createDate: Date;
  updatedDate: Date;
}

const BasicSalarySchema = new Schema<BasicSalary>({
  id: { type: Number, required: true, unique: true },
  role: { type: Number, required: true, unique: true },
  amount: { type: Number, required: true },
  createDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

const BasicSalaryModel = models.BasicSalary || model<BasicSalary>("BasicSalary", BasicSalarySchema);

export default BasicSalaryModel;
