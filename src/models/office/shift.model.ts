import { Schema, model, Document, models } from "mongoose";

interface Shift extends Document {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    createDate: Date;
    updatedDate: Date;
}

const ShiftSchema = new Schema<Shift>({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

const ShiftModel = models.Shift || model<Shift>("Shift", ShiftSchema);

export default ShiftModel;
