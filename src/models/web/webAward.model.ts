import { Schema, model, models, Document } from "mongoose";

export interface WebAward extends Document {
    id: number;
    year: string;
    title: string;
    images: string[];
    imageIds: string[];
    isPublish: boolean;
    createDate: Date;
    updatedDate: Date;
}

const webAwardSchema = new Schema<WebAward>({
    id: { type: Number, required: true, unique: true },
    year: { type: String, required: true },
    title: { type: String, required: true },
    images: [{ type: String }],
    imageIds: [{ type: String }],
    isPublish: { type: Boolean, default: true },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

const WebAwardModel = models.web_award || model<WebAward>("web_award", webAwardSchema);

export default WebAwardModel;
