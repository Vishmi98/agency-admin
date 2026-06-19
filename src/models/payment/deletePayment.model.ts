import { Schema, model, Document, models } from "mongoose";


interface DeletePayment extends Document {
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
    branchId: Number;
}

const deletePaymentSchema = new Schema<DeletePayment>(
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
        branchId: { type: Number, required: true }
    }
);

deletePaymentSchema.virtual('invoiceInfo', {
    ref: 'Invoice',
    localField: 'invoiceId',
    foreignField: 'id',
    justOne: true,
});

deletePaymentSchema.virtual('studentInfo', {
    ref: 'Student',
    localField: 'studentId',
    foreignField: 'id',
    justOne: true,
});

deletePaymentSchema.virtual('staffInfo', {
    ref: 'Staff',
    localField: 'createdBy',
    foreignField: 'id',
    justOne: true,
});

deletePaymentSchema.virtual('paymentTypeInfo', {
    ref: 'PaymentType',
    localField: 'paymentType',
    foreignField: 'id',
    justOne: true,
});

deletePaymentSchema.virtual('branchInfo', {
    ref: 'Branch',
    localField: 'branchId',
    foreignField: 'id',
    justOne: true,
});

deletePaymentSchema.set("toObject", { virtuals: true });
deletePaymentSchema.set("toJSON", { virtuals: true });

const DeletePaymentModel = models.DeletePayment || model<DeletePayment>("DeletePayment", deletePaymentSchema);

export default DeletePaymentModel;
