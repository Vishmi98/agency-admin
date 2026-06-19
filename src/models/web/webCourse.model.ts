import { Schema, model, Document, models } from "mongoose";

interface WebCourse extends Document {
    id: number;
    courseName: string;
    qualification: number;
    duration: number;
    nextIntake: string;
    studyType: number;
    overview: string;
    uniId: number;
    rank: number;
    entryScore: string;
    price: number;
    url: string;
    coverImage: string;
    coverImageId: string;
    images: string[];
    imageIds: string[];
    isPublish: boolean;
    createDate: Date;
    updatedDate: Date;
}

const webCourseSchema = new Schema<WebCourse>({
    id: { type: Number, required: true, unique: true },
    courseName: { type: String, required: true },
    qualification: { type: Number },
    duration: { type: Number },
    nextIntake: { type: String },
    studyType: { type: Number },
    overview: { type: String },
    uniId: { type: Number, required: true },
    rank: { type: Number },
    entryScore: { type: String },
    price: { type: Number },
    url: { type: String },
    coverImage: { type: String },
    coverImageId: { type: String },
    images: [{ type: String }],
    imageIds: [{ type: String }],
    isPublish: { type: Boolean, default: true },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
});

webCourseSchema.virtual('uniInfo', {
    ref: 'web_university',
    localField: 'uniId',
    foreignField: 'id',
    justOne: true,
});

webCourseSchema.virtual('qualificationInfo', {
    ref: 'Qualification',
    localField: 'qualification',
    foreignField: 'id',
    justOne: true,
});

webCourseSchema.virtual('studyTypeInfo', {
    ref: 'StudyType',
    localField: 'studyType',
    foreignField: 'id',
    justOne: true,
});

webCourseSchema.set("toObject", { virtuals: true });
webCourseSchema.set("toJSON", { virtuals: true });

const WebCourseModel = models.web_course || model<WebCourse>("web_course", webCourseSchema);

export default WebCourseModel;
