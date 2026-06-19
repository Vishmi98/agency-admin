import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ExpenseTypeModel from "@/models/common/expenseType.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
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
        const { title } = body;

        if (!title?.SN || !title?.EN || !title?.TM) {
            return sendErrorResponse("Missing required fields in expenseType", 200);
        }

        const existing = await ExpenseTypeModel.findOne({
            $or: [
                { "title.SN": title.SN },
                { "title.EN": title.EN },
                { "title.TM": title.TM },
            ],
        });

        if (existing) {
            return sendErrorResponse("Expense type with the same title already exists", 200);
        }

        let id = 1;
        const lastRecord = await ExpenseTypeModel.findOne({}, { id: 1 })
            .sort({ id: -1 })
            .limit(1);

        if (lastRecord) {
            id = lastRecord.id + 1;
        }

        const expenseType = await ExpenseTypeModel.create({ id, title });

        return sendSuccessResponse("Expense type created successfully!", { expenseType });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
