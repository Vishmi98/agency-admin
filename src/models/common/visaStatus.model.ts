import { Schema, model, Document, models } from "mongoose";

import { multiLanguageType } from "@/type/common.types";


interface VistaStatus extends Document {
    id: number;
    title: multiLanguageType;
    createdBy: number;
    createDate: Date;
    updatedDate: Date;
}

const VistaStatusSchema = new Schema<VistaStatus>({
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

const VistaStatusModel = models.VistaStatus || model<VistaStatus>("VistaStatus", VistaStatusSchema);

export default VistaStatusModel;
