import { Schema, model, models, Document } from "mongoose";

export interface Course extends Document {
    id: number;

    // Basic Info
    title: string;
    shortCode?: string;
    description?: string;

    // Institution
    universityId: number;

    // Academic Info
    level: string; // NZQA Level 9
    credits: number;
    duration: string; // 18 Months

    // Course Structure
    structure?: string;

    // Specializations
    specializations: string[];

    // Intakes
    intakes: string[];

    // Requirements
    entryRequirements: string[];

    englishRequirement: {
        test: string; // IELTS Academic
        overallScore: number;
        minimumBand: number;
    };

    // Outcomes
    careerOpportunities: string[];

    // Marketing Features
    features: string[];

    // Pricing (optional for education agents)
    tuitionFee?: number;
    applicationFee?: number;

    // Meta
    isActive: boolean;

    createDate: Date;
    updatedDate: Date;
}

const courseSchema = new Schema<Course>(
    {
        id: { type: Number, required: true, unique: true },

        // Basic Info
        title: { type: String, required: true },
        shortCode: { type: String },
        description: { type: String },

        // Institution
        universityId: { type: Number, required: true },

        // Academic Info
        level: { type: String, required: true },
        credits: { type: Number, required: true },
        duration: { type: String, required: true },

        structure: { type: String },

        // Arrays
        specializations: [{ type: String }],
        intakes: [{ type: String }],
        entryRequirements: [{ type: String }],
        careerOpportunities: [{ type: String }],
        features: [{ type: String }],

        // English requirement (nested object)
        englishRequirement: {
            test: { type: String, required: true },
            overallScore: { type: Number, required: true },
            minimumBand: { type: Number, required: true },
        },

        // Pricing
        tuitionFee: { type: Number, default: 0 },
        applicationFee: { type: Number, default: 0 },

        // Meta
        isActive: { type: Boolean, default: true },

        createDate: { type: Date, default: Date.now },
        updatedDate: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

/**
 * VIRTUAL POPULATIONS (optional but useful)
 */
courseSchema.virtual("universityInfo", {
    ref: "University",
    localField: "universityId",
    foreignField: "id",
    justOne: true,
});

/**
 * ENABLE VIRTUALS
 */
courseSchema.set("toObject", { virtuals: true });
courseSchema.set("toJSON", { virtuals: true });

/**
 * MODEL EXPORT
 */
const CourseModel =
    models.Course || model<Course>("Course", courseSchema);

export default CourseModel;