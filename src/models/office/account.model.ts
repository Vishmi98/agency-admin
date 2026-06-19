import { Schema, model, Document, models } from "mongoose";


interface Account extends Document {
  id: number;
  type: "income" | "expense" | "salary";
  sourceId: number; // links to Expense.id or Payment.id
  amount: number;
  description?: string;
  studentId?: number; // only for payments
  branchId?: number; // only for payments
  date: string;
  createDate: Date;
  updatedDate: Date;
}

const accountSchema = new Schema<Account>(
  {
    id: { type: Number, required: true, unique: true },
    type: { type: String, enum: ["income", "expense", "salary"], required: true },
    sourceId: { type: Number, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    studentId: { type: Number },
    branchId: { type: Number },
    date: { type: String, required: true },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
  }
);

accountSchema.virtual("expenseInfo", {
  ref: "Expense",
  localField: "sourceId",
  foreignField: "id",
  justOne: true,
});

accountSchema.virtual("paymentInfo", {
  ref: "Payment",
  localField: "sourceId",
  foreignField: "id",
  justOne: true,
});

accountSchema.virtual("salaryInfo", {
  ref: "Salary",
  localField: "sourceId",
  foreignField: "id",
  justOne: true,
});

accountSchema.set("toObject", { virtuals: true });
accountSchema.set("toJSON", { virtuals: true });

const AccountModel = models.Account || model<Account>("Account", accountSchema);

export default AccountModel;
