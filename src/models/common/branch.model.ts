import { Schema, model, Document, models } from "mongoose";

import { multiLanguageType } from "@/type/common.types";


interface Branch extends Document {
    id: number;
    title: multiLanguageType;
    createdBy: number;
    createDate: Date;
    updatedDate: Date;
}

const BranchSchema = new Schema<Branch>({
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


const BranchModel = models.Branch || model<Branch>("Branch", BranchSchema);

export default BranchModel;
