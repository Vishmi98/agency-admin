import { Schema, model, Document, models } from "mongoose";

interface Package extends Document {
    id: number;
    title: string;
    countryId: number;
    uniId: number;
    courseName: string;
    cost: number;
    price: number;
    startDate: string;
    qualification: number;
    duration: number;
    nextIntake: string;
    entryQualification?: number;
    studyType: number;
    language: number;
    createdBy: number;
    costInLkr: number;
    priceInLkr: number;
    createDate: Date;
    updatedDate: Date;
}

const packageSchema = new Schema<Package>({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    countryId: { type: Number, required: true },
    uniId: { type: Number, required: true },
    courseName: { type: String, required: true },
    cost: { type: Number, required: true },
    price: { type: Number, required: true },
    startDate: { type: String, required: true },
    qualification: { type: Number, required: true },
    duration: { type: Number },
    nextIntake: { type: String },
    entryQualification: { type: Number },
    studyType: { type: Number, required: true },
    language: { type: Number },
    createdBy: { type: Number, required: true },
    costInLkr: { type: Number, default: 0 },
    priceInLkr: { type: Number, default: 0 },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

packageSchema.virtual('countryInfo', {
    ref: 'Country',
    localField: 'countryId',
    foreignField: 'id',
    justOne: true,
});

packageSchema.virtual('uniInfo', {
    ref: 'University',
    localField: 'uniId',
    foreignField: 'id',
    justOne: true,
});

packageSchema.virtual('qualificationInfo', {
    ref: 'Qualification',
    localField: 'qualification',
    foreignField: 'id',
    justOne: true,
});

packageSchema.virtual('entryQualificationInfo', {
    ref: 'Qualification',
    localField: 'entryQualification',
    foreignField: 'id',
    justOne: true,
});

packageSchema.virtual('studyTypeInfo', {
    ref: 'StudyType',
    localField: 'studyType',
    foreignField: 'id',
    justOne: true,
});

packageSchema.virtual('languageInfo', {
    ref: 'Language',
    localField: 'language',
    foreignField: 'id',
    justOne: true,
});

packageSchema.virtual('staffInfo', {
    ref: 'Staff',
    localField: 'createdBy',
    foreignField: 'id',
    justOne: true,
});


packageSchema.set("toObject", { virtuals: true });
packageSchema.set("toJSON", { virtuals: true });

const PackageModel = models.Package || model<Package>("Package", packageSchema);

export default PackageModel;
