import { Schema, model, Document, models } from "mongoose";

import { multiLanguageType } from "@/type/common.types";


interface InvoiceStatus extends Document {
    id: number;
    title: multiLanguageType;
    color: string;
    createdBy: number;
    createDate: Date;
    updatedDate: Date;
}

const InvoiceStatusSchema = new Schema<InvoiceStatus>({
    id: { type: Number, required: true, unique: true },
    title: {
        SN: { type: String, required: true },
        EN: { type: String, required: true },
        TM: { type: String, required: true },
    },
    color: { type: String, required: true },
    createdBy: { type: Number },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

const InvoiceStatusModel = models.InvoiceStatus || model<InvoiceStatus>("InvoiceStatus", InvoiceStatusSchema);

export default InvoiceStatusModel;
