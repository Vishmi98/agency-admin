import { Schema, model, Document, models } from "mongoose";

interface UniversityPayment extends Document {
    id: number;
    invoiceId: number;
    paymentType: number;
    documentPath: string;
    documentId: string;
    createdBy: number;
    date: string;
    createDate: Date;
    updatedDate: Date;
}

const universityPaymentSchema = new Schema<UniversityPayment>(
    {
        id: { type: Number, required: true, unique: true },
        invoiceId: { type: Number, required: true },
        paymentType: { type: Number, required: true },
        documentPath: { type: String },
        documentId: { type: String },
        createdBy: { type: Number, required: true },
        date: { type: String, required: true, },
        createDate: { type: Date, default: Date.now },
        updatedDate: { type: Date, default: Date.now },
    }
);

universityPaymentSchema.virtual('invoiceInfo', {
    ref: 'Invoice',
    localField: 'invoiceId',
    foreignField: 'id',
    justOne: true,
});

universityPaymentSchema.virtual('staffInfo', {
    ref: 'Staff',
    localField: 'createdBy',
    foreignField: 'id',
    justOne: true,
});

universityPaymentSchema.virtual('paymentTypeInfo', {
    ref: 'PaymentType',
    localField: 'paymentType',
    foreignField: 'id',
    justOne: true,
});

universityPaymentSchema.set("toObject", { virtuals: true });
universityPaymentSchema.set("toJSON", { virtuals: true });

const UniversityPaymentModel = models.UniversityPayment || model<UniversityPayment>("UniversityPayment", universityPaymentSchema);

export default UniversityPaymentModel;
