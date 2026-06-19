import mongoose, { Schema, Document } from "mongoose";

export interface IMonthlyPayment extends Document {
    companyName: string;
    year: number;
    month: number; // 1 - 12
    isPaid: boolean;
    sendMessage: boolean;
    paidAt?: Date;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

const MonthlyPaymentSchema = new Schema<IMonthlyPayment>(
    {
        companyName: {
            type: String,
            required: true,
            default: "Real Smart",
        },
        year: {
            type: Number,
            required: true,
        },
        month: {
            type: Number,
            required: true,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        sendMessage: {
            type: Boolean,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        message: {
            type: String
        }
    },
    { timestamps: true }
);

// Prevent model overwrite in dev
export default mongoose.models.MonthlyPayment ||
    mongoose.model<IMonthlyPayment>("MonthlyPayment", MonthlyPaymentSchema);
