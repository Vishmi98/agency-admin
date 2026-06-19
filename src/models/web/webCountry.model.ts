import { Schema, model, Document, models } from "mongoose";

interface WebCountry extends Document {
    id: number;
    country: string;
    image: string;
    title: string;
    shortDescription: string;
    popularity: string;
    advantage1: string;
    advantage2: string;
    advantage3: string;
    advantage4: string;
    advantage5: string;
    requirement1: string;
    requirement2: string;
    requirement3: string;
    requirement4: string;
    requirement5: string;
    cost1: string;
    cost2: string;
    cost3: string;
    cost4: string;
    scholarships1: string;
    scholarships2: string;
    scholarships3: string;
    scholarships4: string;
    universities: number[] | [];
    url: string;
    isPublish: boolean;
    createDate: Date;
    updatedDate: Date;
}

const webCountrySchema = new Schema<WebCountry>({
    id: { type: Number, unique: true },
    country: { type: String, required: true },
    image: { type: String },
    title: { type: String },
    shortDescription: { type: String },
    popularity: { type: String },
    advantage1: { type: String },
    advantage2: { type: String },
    advantage3: { type: String },
    advantage4: { type: String },
    advantage5: { type: String },
    requirement1: { type: String },
    requirement2: { type: String },
    requirement3: { type: String },
    requirement4: { type: String },
    requirement5: { type: String },
    cost1: { type: String },
    cost2: { type: String },
    cost3: { type: String },
    cost4: { type: String },
    scholarships1: { type: String },
    scholarships2: { type: String },
    scholarships3: { type: String },
    scholarships4: { type: String },
    universities: [{ type: Number }],
    url: { type: String, required: true, unique: true },
    isPublish: { type: Boolean, default: true },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

webCountrySchema.virtual('universitiesInfo', {
    ref: 'web_university',
    localField: 'universities',
    foreignField: 'id',
    justOne: false,
});

webCountrySchema.set("toObject", { virtuals: true });
webCountrySchema.set("toJSON", { virtuals: true });

const WebCountryModel = models.web_country || model<WebCountry>("web_country", webCountrySchema);

export default WebCountryModel;