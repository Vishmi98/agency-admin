import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/lib/imagekit";
import ExpenseModel from "@/models/office/expense.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const expenseType = formData.get("expenseType");
        const amount = formData.get("amount");
        const smallDescription = formData.get("smallDescription")?.toString() || "";
        const createdBy = formData.get("createdBy");
        const date = formData.get("date")?.toString();
        const documentFile = formData.get("image") as File | null;
        const branchId = formData.get("branchId");

        if (!date?.trim() || !expenseType || !amount || !createdBy) {
            return sendErrorResponse("All required fields must be provided.", 200);
        }

        const expenseTypeNum = Number(expenseType);
        const amountNum = Number(amount);
        const createdByNum = Number(createdBy);
        const branchIdNum = Number(branchId);

        if (isNaN(expenseTypeNum) || isNaN(amountNum) || isNaN(createdByNum) || isNaN(branchIdNum)) {
            return sendErrorResponse("Numeric fields must be valid numbers.", 200);
        }

        let documentPath = "";
        let documentId = "";

        if (documentFile) {
            const buffer = Buffer.from(await documentFile.arrayBuffer());
            const filename = `${Date.now()}-${documentFile.name}`;
            const uploaded = await ImageKitService.uploadImage(buffer, filename, "expenses");

            documentPath = uploaded.url;
            documentId = uploaded.fileId;
        }

        let id = 100;
        const lastExpense = await ExpenseModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
        if (lastExpense?.id) {
            id = lastExpense.id + 1;
        }

        const expense = await ExpenseModel.create({
            id,
            expenseType: expenseTypeNum,
            amount: amountNum,
            smallDescription,
            documentPath,
            documentId,
            createdBy: createdByNum,
            date,
            branchId: branchIdNum,
            createDate: new Date(),
            updatedDate: new Date(),
        });

        return sendSuccessResponse("Expense created successfully", { expense });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
