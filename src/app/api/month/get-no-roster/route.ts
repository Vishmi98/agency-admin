import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import MonthModel from "@/models/office/month.model";
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

        const months = await MonthModel.find({ isRosterCreated: false })
            .select("-__v -createDate -updatedDate")

        return sendSuccessResponse("Fetched months without rosters successfully", months);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
