import { Schema, model, models, Document } from "mongoose";

export interface WebUniversity extends Document {
    id: number;
    name: string;
    code: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    countryId: number;
    internationalStudentCount: number;
    livingCost: number;
    currency: string;
    localRanking: number;
    worldRanking: number;
    overview: string;
    universityWebsite: string;
    url: string;
    coverImage: string;
    coverImageId: string;
    logo: string;
    logoId: string;
    images: string[];
    imageIds: string[];
    isPublish: boolean;
    createDate: Date;
    updatedDate: Date;
}

const webUniversitySchema = new Schema<WebUniversity>({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    city: { type: String },
    countryId: { type: Number },
    internationalStudentCount: { type: Number },
    livingCost: { type: Number },
    currency: { type: String },
    localRanking: { type: Number },
    worldRanking: { type: Number },
    overview: { type: String },
    universityWebsite: { type: String },
    url: { type: String, required: true },
    coverImage: { type: String },
    coverImageId: { type: String },
    logo: { type: String },
    logoId: { type: String },
    images: [{ type: String }],
    imageIds: [{ type: String }],
    isPublish: { type: Boolean, default: true },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

webUniversitySchema.virtual("countryInfo", {
    ref: "web_country",
    localField: "countryId",
    foreignField: "id",
    justOne: true,
});

webUniversitySchema.set("toObject", { virtuals: true });
webUniversitySchema.set("toJSON", { virtuals: true });

const WebUniversityModel = models.web_university || model<WebUniversity>("web_university", webUniversitySchema);

export default WebUniversityModel;
