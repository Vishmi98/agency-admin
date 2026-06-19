import mongoose from "mongoose";

const successStorySchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        documentPath: { type: String },
        documentId: { type: String },
        isPublish: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const SuccessStory =
    mongoose.models.SuccessStory || mongoose.model("SuccessStory", successStorySchema);

export default SuccessStory;