import { Schema, model, Document, models } from "mongoose";

interface Attendance extends Document {
    id: number;
    staffId: number;
    date: string;
    inTime: string;
    outTime: string;
    leave: number;
    createdBy: number;
    createDate: Date;
    updatedDate: Date;
}

const AttendanceSchema = new Schema<Attendance>({
    id: { type: Number, required: true, unique: true },
    staffId: { type: Number, required: true, },
    date: { type: String, required: true, },
    inTime: { type: String, default: '' },
    outTime: { type: String, default: '' },
    leave: { type: Number, default: 0 },
    createdBy: { type: Number, default: 0 },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

AttendanceSchema.virtual('staffInfo', {
    ref: 'Staff',
    localField: 'staffId',
    foreignField: 'id',
    justOne: true,
});

AttendanceSchema.virtual('leaveInfo', {
    ref: 'LeaveType',
    localField: 'leave',
    foreignField: 'id',
    justOne: true,
});

AttendanceSchema.set("toObject", { virtuals: true });
AttendanceSchema.set("toJSON", { virtuals: true });

const AttendanceModel = models.Attendance || model<Attendance>("Attendance", AttendanceSchema);

export default AttendanceModel;
