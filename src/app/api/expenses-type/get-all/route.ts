import { NextRequest } from "next/server";

import { authenticate } from "@/lib/authenticate";
import { connectDB } from "@/lib/mongodb";
import ExpenseTypeModel from "@/models/common/expenseType.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const expenseTypes = await ExpenseTypeModel.find()
            .select("-_id -__v -createDate -updatedDate")
            .sort({ createDate: -1 })
            .exec();

        return sendSuccessResponse("Expense types fetched successfully", { expenseTypes });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
