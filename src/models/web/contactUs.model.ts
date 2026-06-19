import { Schema, model, Document, models } from "mongoose";

interface ContactUs extends Document {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryId: number;
    universityId: number;
    courseId: number;
    branchId: number;
    studyLevelId: number;
    message: string;
    status: number;
    createDate: Date;
    updatedDate: Date;
}

const contactUsSchema = new Schema<ContactUs>({
    id: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    countryId: { type: Number, required: true },
    universityId: { type: Number, required: true },
    courseId: { type: Number, required: true },
    branchId: { type: Number, required: true },
    studyLevelId: { type: Number, required: true },
    message: { type: String, required: true },
    status: { type: Number, default: 1 },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
});


contactUsSchema.virtual('countryInfo', {
    ref: 'web_country',
    localField: 'countryId',
    foreignField: 'id',
    justOne: true,
});

contactUsSchema.virtual('uniInfo', {
    ref: 'web_university',
    localField: 'universityId',
    foreignField: 'id',
    justOne: true,
});

contactUsSchema.virtual('courseInfo', {
    ref: 'web_course',
    localField: 'courseId',
    foreignField: 'id',
    justOne: true,
});

contactUsSchema.virtual('branchInfo', {
    ref: 'Branch',
    localField: 'branchId',
    foreignField: 'id',
    justOne: true,
});

contactUsSchema.virtual('studyInfo', {
    ref: 'Qualification',
    localField: 'studyLevelId',
    foreignField: 'id',
    justOne: true,
});

contactUsSchema.virtual("statusInfo", {
    ref: "LeadStatus",
    localField: "status",
    foreignField: "id",
    justOne: true,
});

contactUsSchema.set("toObject", { virtuals: true });
contactUsSchema.set("toJSON", { virtuals: true });

const ContactUsModel = models.web_contactUs || model<ContactUs>("web_contactUs", contactUsSchema);

export default ContactUsModel;
