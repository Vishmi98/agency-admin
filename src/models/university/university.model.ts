import { Schema, model, Document, models } from "mongoose";

interface University extends Document {
    id: number;
    name: string;
    address: string;
    countryId: number;
    phoneNumber: string;
    email: string;
    isPublish: boolean;
    staffId: number;
    rank: number;
    code: number;
    createdDate: Date;
    avatarPath?: string;
    avatarFileId?: string;
}

const UniversitySchema = new Schema<University>({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    avatarPath: { type: String, required: false },
    avatarFileId: { type: String, required: false },
    address: { type: String, required: true },
    countryId: { type: Number, required: true },
    staffId: { type: Number, required: true },
    rank: { type: Number, required: true },
    code: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isPublish: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now },
});

UniversitySchema.virtual('countryInfo', {
    ref: 'Country',
    localField: 'countryId',
    foreignField: 'id',
    justOne: true,
});

UniversitySchema.virtual('staffInfo', {
    ref: 'Staff',
    localField: 'staffId',
    foreignField: 'id',
    justOne: true,
});

UniversitySchema.set("toObject", { virtuals: true });
UniversitySchema.set("toJSON", { virtuals: true });

const UniversityModel = models.University || model<University>("University", UniversitySchema);

export default UniversityModel;
