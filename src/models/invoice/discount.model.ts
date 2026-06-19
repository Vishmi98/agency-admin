import { Schema, model, Document, models } from "mongoose";

import { multiLanguageType } from "@/type/common.types";


interface Discount extends Document {
    id: number;
    title: multiLanguageType;
    amount: number;
    currency: string;
    createdBy: number;
    createDate: Date;
    updatedDate: Date;
}

const discountSchema = new Schema<Discount>({
    id: { type: Number, required: true, unique: true },
    title: {
        SN: { type: String, required: true },
        EN: { type: String, required: true },
        TM: { type: String, required: true },
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    createdBy: { type: Number },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});


const DiscountModel = models.Discount || model<Discount>("Discount", discountSchema);

export default DiscountModel;
