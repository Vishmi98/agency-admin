import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import WebUniversityModel from "@/models/web/webUniversity.model";
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
        const { id, isPublish } = body;

        if (typeof id !== "number" || typeof isPublish !== "boolean") {
            return sendErrorResponse("Invalid request data", 200);
        }

        const university = await WebUniversityModel.findOneAndUpdate(
            { id },
            { isPublish, updatedDate: new Date() },
            { new: true }
        ).select("id university isPublish");

        if (!university) {
            return sendErrorResponse("University not found", 200);
        }

        return sendSuccessResponse(`University ${isPublish ? "published" : "unpublished"} successfully`, { university });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
