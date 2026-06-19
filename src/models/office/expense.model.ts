import { Schema, model, Document, models } from "mongoose";

interface Expense extends Document {
    id: number;
    expenseType: number;
    amount: number;
    smallDescription: string;
    documentPath: string;
    documentId: string;
    createdBy: number;
    date: string;
    branchId: number;
    createDate: Date;
    updatedDate: Date;
}

const expenseSchema = new Schema<Expense>(
    {
        id: { type: Number, required: true, unique: true },
        expenseType: { type: Number, required: true },
        amount: { type: Number, required: true },
        smallDescription: { type: String, required: false },
        documentPath: { type: String },
        documentId: { type: String },
        createdBy: { type: Number, required: true },
        date: { type: String, required: true, },
        branchId: { type: Number, default: 0 },
        createDate: { type: Date, default: Date.now },
        updatedDate: { type: Date, default: Date.now },
    }
);

expenseSchema.virtual('staffInfo', {
    ref: 'Staff',
    localField: 'createdBy',
    foreignField: 'id',
    justOne: true,
});

expenseSchema.virtual('expenseTypeInfo', {
    ref: 'ExpenseType',
    localField: 'expenseType',
    foreignField: 'id',
    justOne: true,
});

expenseSchema.virtual('branchInfo', {
    ref: 'Branch',
    localField: 'branchId',
    foreignField: 'id',
    justOne: true,
});

expenseSchema.set("toObject", { virtuals: true });
expenseSchema.set("toJSON", { virtuals: true });

const ExpenseModel = models.Expense || model<Expense>("Expense", expenseSchema);

export default ExpenseModel;
