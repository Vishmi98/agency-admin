import { Schema, model, models, Document } from "mongoose";

export interface Inquiry extends Document {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;

    source?: string; // which client/system sent it
    apiKey?: string; // optional tracking

    status: number; // 1 = new, 2 = in progress, 3 = closed

    createDate: Date;
    updatedDate: Date;
}

const inquirySchema = new Schema<Inquiry>({
    id: { type: Number, required: true, unique: true },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },

    source: { type: String },
    apiKey: { type: String },

    status: { type: Number, default: 1 },

    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

const InquiryModel =
    models.Inquiry || model<Inquiry>("Inquiry", inquirySchema);

export default InquiryModel;