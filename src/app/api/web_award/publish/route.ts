import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import WebAwardModel from "@/models/web/webAward.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { awardId, isPublish } = body;

        // Validate input
        if (!awardId || typeof isPublish !== "boolean") {
            return sendErrorResponse("Missing or invalid fields: awardId or isPublish", 200);
        }

        // Find and update 
        const updatedAward = await WebAwardModel.findOneAndUpdate(
            { id: awardId },
            { isPublish },
            { new: true }
        );

        if (!updatedAward) {
            return sendErrorResponse("Award not found", 200);
        }

        return sendSuccessResponse(`Award ${isPublish ? "published" : "unpublished"} successfully`, { award: updatedAward });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
