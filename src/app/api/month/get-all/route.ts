import { NextRequest } from "next/server";

import { authenticate } from "@/lib/authenticate";
import { connectDB } from "@/lib/mongodb";
import MonthModel from "@/models/office/month.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const months = await MonthModel.find()
            .select("-_id -__v -createDate -updatedDate")
            .sort({ month: -1 });

        return sendSuccessResponse("Months fetched successfully", { months });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
