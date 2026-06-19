import { Schema, model, Document, models } from "mongoose";

interface Lead extends Document {
  id: number;
  studentId: number;
  staffId: number;
  courseId: number;
  status: number;
  note: string;
  createDate: Date;
  updatedDate: Date;
}

const leadSchema = new Schema<Lead>({
  id: { type: Number, required: true, unique: true },
  studentId: { type: Number, required: true },
  staffId: { type: Number, required: true },
  courseId: { type: Number, required: true },
  status: { type: Number, default: 1 },
  note: { type: String },
  createDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

leadSchema.virtual("studentInfo", {
  ref: "Student",
  localField: "studentId",
  foreignField: "id",
  justOne: true,
});

leadSchema.virtual("staffInfo", {
  ref: "Staff",
  localField: "staffId",
  foreignField: "id",
  justOne: true,
});

leadSchema.virtual("courseInfo", {
  ref: "Course",
  localField: "courseId",
  foreignField: "id",
  justOne: true,
});

leadSchema.virtual("statusInfo", {
  ref: "LeadStatus",
  localField: "status",
  foreignField: "id",
  justOne: true,
});

leadSchema.set("toObject", { virtuals: true });
leadSchema.set("toJSON", { virtuals: true });

const LeadModel = models.Lead || model<Lead>("Lead", leadSchema);

export default LeadModel;
