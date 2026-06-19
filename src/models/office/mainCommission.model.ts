import { StaffType } from "@/modules/staff/staff.types";
import { StudentType } from "@/modules/student/student.types";
import { Schema, model, Document, models } from "mongoose";


interface MainCommission extends Document {
  id: number;
  date: string;
  invoiceId: number;
  studentId: number;
  packageId: number;
  uniId: number;
  branchId: number;
  staffId: number;
  amount: number;
  percentage: number;
  dueAmount: number;
  paidAmount: number;
  introduceAmount: number;
  monthlyAmount: number;
  status: "pending" | "available" | "paid";
  introduceAmountPaid: boolean;
  isAutoCreated: boolean;
  studentDetails?: StudentType,
  staffDetails?: StaffType,
  createDate: Date;
  updatedDate: Date;
}

const mainCommissionSchema = new Schema<MainCommission>(
  {
    id: { type: Number, required: true, unique: true },
    date: { type: String, required: true },
    invoiceId: { type: Number, required: true },
    studentId: { type: Number },
    packageId: { type: Number },
    uniId: { type: Number },
    branchId: { type: Number },
    staffId: { type: Number },
    amount: { type: Number, required: true, default: 0 },
    percentage: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    introduceAmount: { type: Number, default: 0 },
    monthlyAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "available", "paid"],
      required: true,
      default: "pending",
    },
    introduceAmountPaid: { type: Boolean, default: false },
    isAutoCreated: { type: Boolean, default: true },
    studentDetails: {
      id: Number,
      title: Schema.Types.Mixed,
      firstName: String,
      lastName: String,
      fullName: String,
      phone: String,
      email: String,
      nic: String,
      address: String,
      passportNo: String,
      issueDate: String,
      expireDate: String,
      visaIssueDate: String,
      visaExpireDate: String,
      createdBy: Schema.Types.Mixed,
      visaStatus: Schema.Types.Mixed,
      branchId: Schema.Types.Mixed,
    },
    staffDetails: {
      id: Number,
      firstName: String,
      lastName: String,
      email: String,
      roll: Number,
      title: Schema.Types.Mixed,
      nic: String,
      gender: Schema.Types.Mixed,
      fullName: String,
      address: String,
      branchId: Schema.Types.Mixed,
      basicSalary: Number,
      commissionAmount: Number,
    },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
  }
);

mainCommissionSchema.virtual("invoiceInfo", {
  ref: "Invoice",
  localField: "invoiceId",
  foreignField: "id",
  justOne: true,
});

mainCommissionSchema.set("toObject", { virtuals: true });
mainCommissionSchema.set("toJSON", { virtuals: true });

const MainCommissionModel = models.MainCommission || model<MainCommission>("MainCommission", mainCommissionSchema);

export default MainCommissionModel;
