import { Schema, model, Document, models } from "mongoose";

import { multiLanguageType } from "@/type/common.types";

interface EmploymentType extends Document {
    id: number;
    title: multiLanguageType;
    createdBy: number;
    createDate: Date;
    updatedDate: Date;
}

const employmentTypeSchema = new Schema<EmploymentType>({
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


const EmploymentTypeModel = models.EmploymentType || model<EmploymentType>("EmploymentType", employmentTypeSchema);

export default EmploymentTypeModel;
