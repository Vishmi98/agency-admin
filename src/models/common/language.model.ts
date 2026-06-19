import { Schema, model, Document, models } from "mongoose";

import { multiLanguageType } from "@/type/common.types";


interface Language extends Document {
    id: number;
    title: multiLanguageType;
    createdBy: number; 
    createDate: Date;
    updatedDate: Date;
}

const languageSchema = new Schema<Language>({
    id: { type: Number, required: true, unique: true },
    title: {
        SN: { type: String, required: true },
        EN: { type: String, required: true },
        TM: { type: String, required: true },
    },
    createdBy: { type: Number }, 
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});


const LanguageModel = models.Language || model<Language>("Language", languageSchema);

export default LanguageModel;
