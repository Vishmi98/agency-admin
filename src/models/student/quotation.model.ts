import { Schema, model, Document } from "mongoose";

export interface QuotationItem {
    title: string;
    amount: number;
};

interface Quotation extends Document {
    id: number;
    invoice: number;
    address: string;
    total: number;
    items: QuotationItem[] | [];
    createDate: Date;
    updatedDate: Date;
}

const QuotationSchema = new Schema<Quotation>({
    id: { type: Number, required: true, unique: true },
    invoice: { type: Number, required: true },
    address: { type: String, required: true },
    total: { type: Number, default: 0 },
    items: [
        {
            title: { type: String, required: true },
            amount: { type: Number, required: true, default: 0 }
        }
    ],
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

QuotationSchema.virtual("invoiceInfo", {
    ref: "Invoice",
    localField: "invoice",
    foreignField: "id",
    justOne: true,
});

QuotationSchema.set("toObject", { virtuals: true });
QuotationSchema.set("toJSON", { virtuals: true });

const QuotationModel = model<Quotation>("Quotation", QuotationSchema);

export default QuotationModel;
