import { Schema, model, Document, models } from "mongoose";

interface SalaryAdvance extends Document {
    staffId: number;
    amount: number;
    approvalBy: number;
    isSettle: boolean;
    isPaid: boolean;
    date: string;
    createDate: Date;
}

const SalaryAdvanceSchema = new Schema<SalaryAdvance>({
    staffId: { type: Number, required: true },
    amount: { type: Number },
    approvalBy: { type: Number },
    isSettle: { type: Boolean },
    isPaid: { type: Boolean, default: false },
    date: { type: String, },
    createDate: { type: Date, default: Date.now },
});

SalaryAdvanceSchema.virtual('staffInfo', {
    ref: 'Staff',
    localField: 'staffId',
    foreignField: 'id',
    justOne: true,
});

SalaryAdvanceSchema.set("toObject", { virtuals: true });
SalaryAdvanceSchema.set("toJSON", { virtuals: true });

const SalaryAdvanceModel = models.SalaryAdvance || model<SalaryAdvance>("SalaryAdvance", SalaryAdvanceSchema);

export default SalaryAdvanceModel;
