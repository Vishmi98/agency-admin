import { Schema, model, Document, models } from "mongoose";


interface Payment extends Document {
    id: number;
    invoiceId: number;
    paymentDate: string;
    amountUsd: number;
    amountLkr: number;
    studentId: number;
    paymentType: number;
    createdBy: number;
    createDate: Date;
    updatedDate: Date;
    branchId: number;
    isArchived: boolean;
}

const paymentSchema = new Schema<Payment>(
    {
        id: { type: Number, required: true, unique: true },
        invoiceId: { type: Number, required: true },
        paymentDate: { type: String, required: true },
        amountUsd: { type: Number, required: true },
        amountLkr: { type: Number, required: true },
        studentId: { type: Number, required: true },
        paymentType: { type: Number, required: true },
        createdBy: { type: Number, required: true },
        createDate: { type: Date, default: Date.now },
        updatedDate: { type: Date, default: Date.now },
        branchId: { type: Number, required: true },
        isArchived: { type: Boolean, default: false }
    }
);

paymentSchema.virtual('invoiceInfo', {
    ref: 'Invoice',
    localField: 'invoiceId',
    foreignField: 'id',
    justOne: true,
});

paymentSchema.virtual('studentInfo', {
    ref: 'Student',
    localField: 'studentId',
    foreignField: 'id',
    justOne: true,
});

paymentSchema.virtual('staffInfo', {
    ref: 'Staff',
    localField: 'createdBy',
    foreignField: 'id',
    justOne: true,
});

paymentSchema.virtual('paymentTypeInfo', {
    ref: 'PaymentType',
    localField: 'paymentType',
    foreignField: 'id',
    justOne: true,
});

paymentSchema.virtual('branchInfo', {
    ref: 'Branch',
    localField: 'branchId',
    foreignField: 'id',
    justOne: true,
});

paymentSchema.set("toObject", { virtuals: true });
paymentSchema.set("toJSON", { virtuals: true });

const PaymentModel = models.Payment || model<Payment>("Payment", paymentSchema);

export default PaymentModel;
