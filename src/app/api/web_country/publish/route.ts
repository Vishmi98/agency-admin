import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import WebCountryModel from "@/models/web/webCountry.model";
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

        const country = await WebCountryModel.findOneAndUpdate(
            { id },
            { isPublish, updatedDate: new Date() },
            { new: true }
        ).select("id country isPublish");

        if (!country) {
            return sendErrorResponse("Country not found", 200);
        }

        return sendSuccessResponse(`Country ${isPublish ? "published" : "unpublished"} successfully`, { country });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
