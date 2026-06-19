import { Schema, model, Document, models } from "mongoose";

export interface IDateEntry {
  id: string;
  date: string;
  isHoliday: boolean;
}

export interface IMonth extends Document {
  month: string;
  dates: IDateEntry[];
  workDays: number;
  createDate: Date;
  updatedDate: Date;
  createdBy?: number;
  isRosterCreated: boolean;
}

const DateSchema = new Schema<IDateEntry>({
  id: { type: String, required: true },
  date: { type: String, required: true },
  isHoliday: { type: Boolean, default: false },
});

const MonthSchema = new Schema<IMonth>({
  month: { type: String, required: true },
  dates: [DateSchema],
  workDays: { type: Number, default: 0 },
  createDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  isRosterCreated: { type: Boolean, default: false },
});

const MonthModel = models.Month || model<IMonth>("Month", MonthSchema);

export default MonthModel;
