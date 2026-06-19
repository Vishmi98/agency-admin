import { NextRequest } from "next/server";

import { authenticate } from "@/lib/authenticate";
import { connectDB } from "@/lib/mongodb";
import TitleModel from "@/models/common/title.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const titles = await TitleModel.find()
            .select("-_id -__v -createDate -updatedDate")

        return sendSuccessResponse("Titles fetched successfully", { titles });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
