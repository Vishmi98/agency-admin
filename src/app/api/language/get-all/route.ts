import { NextRequest } from "next/server";

import { authenticate } from "@/lib/authenticate";
import { connectDB } from "@/lib/mongodb";
import LanguageModel from "@/models/common/language.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const languages = await LanguageModel.find()
            .select("-_id -__v -createDate -updatedDate")

        return sendSuccessResponse("Languages fetched successfully", { languages });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
