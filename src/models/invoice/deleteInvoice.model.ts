import { Schema, model, Document, models } from "mongoose";

interface DeleteInvoice extends Document {
  id: number;
  packageId: number;
  invoiceDate: string;
  dueDate: string;
  dueAmount: number;
  extraPayment: number[] | [];
  discount: number[] | [];
  totalPrice: number;
  studentId: number;
  staffId: number;
  exchangeRate: number;
  currency: string;
  createDate: Date;
  updatedDate: Date;
  branchId: number;
  status: number;
}

const deleteInvoiceSchema = new Schema<DeleteInvoice>({
  id: { type: Number, required: true, unique: true },
  packageId: { type: Number, required: true },
  invoiceDate: { type: String, required: true },
  dueDate: { type: String },
  extraPayment: [{ type: Number }],
  discount: [{ type: Number }],
  totalPrice: { type: Number, required: true },
  dueAmount: { type: Number },
  studentId: { type: Number, required: true },
  staffId: { type: Number, required: true },
  createDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  exchangeRate: { type: Number },
  currency: { type: String, required: true },
  branchId: { type: Number, required: true },
  status: { type: Number, default: 1 },
});

deleteInvoiceSchema.virtual("packageInfo", {
  ref: "Package",
  localField: "packageId",
  foreignField: "id",
  justOne: true,
});

deleteInvoiceSchema.virtual("extraPaymentInfo", {
  ref: "ExtraPayment",
  localField: "extraPayment",
  foreignField: "id",
  justOne: false,
});

deleteInvoiceSchema.virtual("discountInfo", {
  ref: "Discount",
  localField: "discount",
  foreignField: "id",
  justOne: false,
});

deleteInvoiceSchema.virtual("studentInfo", {
  ref: "Student",
  localField: "studentId",
  foreignField: "id",
  justOne: true,
});

deleteInvoiceSchema.virtual("staffInfo", {
  ref: "Staff",
  localField: "staffId",
  foreignField: "id",
  justOne: true,
});

deleteInvoiceSchema.virtual("branchInfo", {
  ref: "Branch",
  localField: "branchId",
  foreignField: "id",
  justOne: true,
});

deleteInvoiceSchema.virtual("statusInfo", {
  ref: "InvoiceStatus",
  localField: "status",
  foreignField: "id",
  justOne: true,
});

deleteInvoiceSchema.virtual("paymentInfo", {
  ref: "Payment",
  localField: "id",
  foreignField: "invoiceId",
  justOne: false,
});

deleteInvoiceSchema.set("toObject", { virtuals: true });
deleteInvoiceSchema.set("toJSON", { virtuals: true });

const DeleteInvoiceModel = models.DeleteInvoice || model<DeleteInvoice>("DeleteInvoice", deleteInvoiceSchema);

export default DeleteInvoiceModel;
