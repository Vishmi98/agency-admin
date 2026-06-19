import { Schema, model, Document, models } from "mongoose";

import { multiLanguageType } from "@/type/common.types";


interface StudyType extends Document {
    id: number;
    title: multiLanguageType;
    createdBy: number;
    createDate: Date;
    updatedDate: Date;
}

const studyTypeSchema = new Schema<StudyType>({
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


const StudyTypeModel = models.StudyType || model<StudyType>("StudyType", studyTypeSchema);

export default StudyTypeModel;
