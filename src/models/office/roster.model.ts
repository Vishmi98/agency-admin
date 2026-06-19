import { Schema, model, Document, models } from "mongoose";

interface Roster extends Document {
  rosterId: string;
  shiftId: number;
  date: string;
  staffId: number;
  createDate: Date;
  updatedDate: Date;
}

const RosterSchema = new Schema<Roster>({
  rosterId: { type: String, required: true, unique: false },
  shiftId: { type: Number, required: true, min: 0 },
  date: { type: String, required: true },
  staffId: { type: Number, required: true },
  createDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

RosterSchema.virtual("staffInfo", {
  ref: "Staff",
  localField: "staffId",
  foreignField: "id",
  justOne: false,
});

RosterSchema.virtual("shiftInfo", {
  ref: "Shift",
  localField: "shiftId",
  foreignField: "id",
  justOne: true,
});

RosterSchema.set("toObject", { virtuals: true });
RosterSchema.set("toJSON", { virtuals: true });

const RosterModel = models.Roster || model<Roster>("Roster", RosterSchema);

export default RosterModel;
