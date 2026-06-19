import { NextRequest } from "next/server";

import { authenticate } from "@/lib/authenticate";
import { connectDB } from "@/lib/mongodb";
import EducationLevelModel from "@/models/common/educationLevel.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const educationLevels = await EducationLevelModel.find()
            .select("-_id -__v -createDate -updatedDate")

        return sendSuccessResponse("Education levels fetched successfully", { educationLevels });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
