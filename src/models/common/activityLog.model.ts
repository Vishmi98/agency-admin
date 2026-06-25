import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
    userId: { type: Number, required: true },

    action: { type: String, required: true },
    // e.g: "STAFF_PAGE_VIEW", "EDIT_STAFF_CLICK", "API_STAFF_GET_ALL"

    endpoint: { type: String },
    path: { type: String },
    method: { type: String },

    meta: { type: Object }, // optional extra data

    createdAt: { type: Date, default: Date.now },
});

ActivityLogSchema.virtual('userInfo', {
    ref: 'Staff',
    localField: 'userId',
    foreignField: 'id',
    justOne: true,
});

ActivityLogSchema.set("toObject", { virtuals: true });
ActivityLogSchema.set("toJSON", { virtuals: true });

const ActivityLogModel =
    mongoose.models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);

export default ActivityLogModel;