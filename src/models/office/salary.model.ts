import { Schema, model, Document, models } from "mongoose";

interface AdditionalIncentiveType {
    title: string;
    amount: number;
};

interface Salary extends Document {
    id: number;
    month: string;
    staffId: number;
    basicSalary: number;
    commissionAmount: number;
    attendances: string[];
    leaves: string[];
    workingDays: number;
    workedDays: number;
    salaryAdvance: number[];
    totalDeduction: number;
    totalSalaryAdvance: number;
    commissionAvailableInvoiceIds: number[];
    totalNoPayDeduction: number;
    noPayPerDay: number;
    grossSalary: number;
    netSalary: number;
    isPaid: boolean;
    additional: AdditionalIncentiveType[] | [];
    branchId: number;
    mainCommissionIds: number[];
    subCommissionIds: number[];
    createDate: Date;
    updatedDate: Date;
}

const salarySchema = new Schema<Salary>({
    id: { type: Number, required: true, unique: true },
    month: { type: String, required: true },
    staffId: { type: Number, required: true },
    basicSalary: { type: Number, default: 0 },
    commissionAmount: { type: Number, default: 0 },
    attendances: [{ type: String }],
    leaves: [{ type: String }],
    workingDays: { type: Number, default: 0 },
    workedDays: { type: Number, default: 0 },
    salaryAdvance: [{ type: Number }],
    totalSalaryAdvance: { type: Number, default: 0 },
    totalDeduction: { type: Number, default: 0 },
    commissionAvailableInvoiceIds: [{ type: Number }],
    totalNoPayDeduction: { type: Number, default: 0 },
    noPayPerDay: { type: Number, default: 0 },
    grossSalary: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    additional: [
        {
            title: { type: String, required: true },
            amount: { type: Number, required: true, default: 0 }
        }
    ],
    branchId: { type: Number, default: 0 },
    mainCommissionIds: [{ type: Number }],
    subCommissionIds: [{ type: Number }],
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

salarySchema.virtual("branchInfo", {
    ref: "Branch",
    localField: "branchId",
    foreignField: "id",
    justOne: true,
});

salarySchema.virtual("staffInfo", {
    ref: "Staff",
    localField: "staffId",
    foreignField: "id",
    justOne: true,
});

salarySchema.virtual("monthInfo", {
    ref: "Month",
    localField: "month",
    foreignField: "month",
    justOne: true,
});

salarySchema.virtual("attendanceInfo", {
    ref: "Attendance",
    localField: "attendances",
    foreignField: "date",
    justOne: false,
});

salarySchema.virtual('salaryAdvanceInfo', {
    ref: 'SalaryAdvance',
    localField: 'salaryAdvance',
    foreignField: 'staffId',
    justOne: false,
});

salarySchema.virtual("mainCommissionInfo", {
    ref: "MainCommission",
    localField: "mainCommissionIds",
    foreignField: "id",
    justOne: false,
});

salarySchema.virtual("subCommissionInfo", {
    ref: "SubCommission",
    localField: "subCommissionIds",
    foreignField: "id",
    justOne: false,
});

salarySchema.set("toObject", { virtuals: true });
salarySchema.set("toJSON", { virtuals: true });

const SalaryModel = models.Salary || model<Salary>("Salary", salarySchema);

export default SalaryModel;
