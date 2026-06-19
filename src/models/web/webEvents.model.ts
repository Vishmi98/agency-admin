import { Schema, model, models, Document } from "mongoose";

export interface WebEvents extends Document {
    id: number;
    eventName: string;
    images: string[];
    imageIds: string[];
    isPublish: boolean;
    createDate: Date;
    updatedDate: Date;
}

const webEventsSchema = new Schema<WebEvents>({
    id: { type: Number, required: true, unique: true },
    eventName: { type: String, required: true },
    images: [{ type: String }],
    imageIds: [{ type: String }],
    isPublish: { type: Boolean, default: true },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

const WebEventsModel = models.web_events || model<WebEvents>("web_events", webEventsSchema);

export default WebEventsModel;
