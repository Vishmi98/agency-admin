import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import GenderModel from "@/models/common/gender.model";
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

        const genders = await GenderModel.find()
            .select("-_id -__v -createDate -updatedDate")

        return sendSuccessResponse("Genders fetched successfully", { genders });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
