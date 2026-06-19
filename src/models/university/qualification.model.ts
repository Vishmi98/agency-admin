import { Schema, model, Document, models } from "mongoose";

import { multiLanguageType } from "@/type/common.types";


interface Qualification extends Document {
    id: number;
    title: multiLanguageType;
    createdBy: number;
    createDate: Date;
    updatedDate: Date;
    type: number;
    order: number;
}

const qualificationSchema = new Schema<Qualification>({
    id: { type: Number, required: true, unique: true },
    title: {
        SN: { type: String, required: true },
        EN: { type: String, required: true },
        TM: { type: String, required: true },
    },
    createdBy: { type: Number },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    type: { type: Number, default: 0 },
    order: { type: Number },
});


const QualificationModel = models.Qualification || model<Qualification>("Qualification", qualificationSchema);

export default QualificationModel;
