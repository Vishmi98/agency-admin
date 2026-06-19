import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ExpenseTypeModel from "@/models/common/expenseType.model";
import { authenticate } from "@/lib/authenticate";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const body = await req.json();
        const { id } = body;

        if (typeof id !== "number") {
            return sendErrorResponse("Invalid or missing id", 200);
        }

        const expenseType = await ExpenseTypeModel.findOne({ id })
            .select("id title -_id")
            .exec();

        return sendSuccessResponse("Expense type fetched successfully", { expenseType });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
