import { Schema, model, Document, models } from "mongoose";

import { multiLanguageType } from "@/type/common.types";


interface LeadStatus extends Document {
    id: number;
    title: multiLanguageType;
    color: string;
    createDate: Date;
    updatedDate: Date;
}

const leadStatusSchema = new Schema<LeadStatus>({
    id: { type: Number, required: true, unique: true },
    title: {
        SN: { type: String, required: true },
        EN: { type: String, required: true },
        TM: { type: String, required: true },
    },
    color: { type: String, required: true },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});


const LeadStatusModel = models.LeadStatus || model<LeadStatus>("LeadStatus", leadStatusSchema);

export default LeadStatusModel;
