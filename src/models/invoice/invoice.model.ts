import { Schema, model, Document, models } from "mongoose";

interface Invoice extends Document {
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
  packagePriceUpdatePrice: number;
  version: number;
  difference: number;
  package: {
    id: number;
    title: string;
    countryId: number;
    uniId: number;
    courseName: string;
    cost: number;
    price: number;
    startDate: string;
    qualification: number;
    duration: number;
    nextIntake: string;
    entryQualification?: number;
    studyType: number;
    language: number;
    createdBy: number;
    costInLkr: number;
    priceInLkr: number;
    createDate: Date;
    updatedDate: Date;
  },
  updatePackageId: number;
  updatePackage: {
    id: number;
    title: string;
    countryId: number;
    uniId: number;
    courseName: string;
    cost: number;
    price: number;
    startDate: string;
    qualification: number;
    duration: number;
    nextIntake: string;
    entryQualification?: number;
    studyType: number;
    language: number;
    createdBy: number;
    costInLkr: number;
    priceInLkr: number;
    createDate: Date;
    updatedDate: Date;
  }
  isArchived: boolean;
}

const invoiceSchema = new Schema<Invoice>({
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
  packagePriceUpdatePrice: { type: Number, default: 0 },
  version: { type: Number, default: 0 },
  difference: { type: Number, default: 0 },
  package: {
    type: {
      id: { type: Number, required: true },
      title: { type: String, required: true },
      countryId: { type: Number, required: true },
      uniId: { type: Number, required: true },
      courseName: { type: String, required: true },
      cost: { type: Number, required: true },
      price: { type: Number, required: true },
      startDate: { type: String, required: true },
      qualification: { type: Number, required: true },
      duration: { type: Number },
      nextIntake: { type: String },
      entryQualification: { type: Number },
      studyType: { type: Number, required: true },
      language: { type: Number },
      createdBy: { type: Number, required: true },
      costInLkr: { type: Number, default: 0 },
      priceInLkr: { type: Number, default: 0 },
      createDate: { type: Date, default: Date.now },
      updatedDate: { type: Date, default: Date.now },
    },
    required: false,
  },
  updatePackageId: { type: Number },
  updatePackage: {
    type: {
      id: { type: Number, required: true },
      title: { type: String, required: true },
      countryId: { type: Number, required: true },
      uniId: { type: Number, required: true },
      courseName: { type: String, required: true },
      cost: { type: Number, required: true },
      price: { type: Number, required: true },
      startDate: { type: String, required: true },
      qualification: { type: Number, required: true },
      duration: { type: Number },
      nextIntake: { type: String },
      entryQualification: { type: Number },
      studyType: { type: Number, required: true },
      language: { type: Number },
      createdBy: { type: Number, required: true },
      costInLkr: { type: Number, default: 0 },
      priceInLkr: { type: Number, default: 0 },
      createDate: { type: Date, default: Date.now },
      updatedDate: { type: Date, default: Date.now },
    },
    required: false,
  },
  isArchived: { type: Boolean, default: false }
});

invoiceSchema.virtual("packageInfo", {
  ref: "Package",
  localField: "packageId",
  foreignField: "id",
  justOne: true,
});

invoiceSchema.virtual("extraPaymentInfo", {
  ref: "ExtraPayment",
  localField: "extraPayment",
  foreignField: "id",
  justOne: false,
});

invoiceSchema.virtual("discountInfo", {
  ref: "Discount",
  localField: "discount",
  foreignField: "id",
  justOne: false,
});

invoiceSchema.virtual("studentInfo", {
  ref: "Student",
  localField: "studentId",
  foreignField: "id",
  justOne: true,
});

invoiceSchema.virtual("staffInfo", {
  ref: "Staff",
  localField: "staffId",
  foreignField: "id",
  justOne: true,
});

invoiceSchema.virtual("branchInfo", {
  ref: "Branch",
  localField: "branchId",
  foreignField: "id",
  justOne: true,
});

invoiceSchema.virtual("statusInfo", {
  ref: "InvoiceStatus",
  localField: "status",
  foreignField: "id",
  justOne: true,
});

invoiceSchema.virtual("paymentInfo", {
  ref: "Payment",
  localField: "id",
  foreignField: "invoiceId",
  justOne: false,
});

invoiceSchema.set("toObject", { virtuals: true });
invoiceSchema.set("toJSON", { virtuals: true });

const InvoiceModel = models.Invoice || model<Invoice>("Invoice", invoiceSchema);

export default InvoiceModel;
