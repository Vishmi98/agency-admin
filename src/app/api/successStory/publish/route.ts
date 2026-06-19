import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import SuccessStory from "@/models/web/successStory.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { successStoryId, isPublish } = body;

        // Validate input
        if (!successStoryId || typeof isPublish !== "boolean") {
            return sendErrorResponse("Missing or invalid fields: successStoryId or isPublish", 200);
        }

        // Find and update 
        const updatedSuccessStory = await SuccessStory.findOneAndUpdate(
            { id: successStoryId },
            { isPublish },
            { new: true }
        );

        if (!updatedSuccessStory) {
            return sendErrorResponse("Success story not found", 200);
        }

        return sendSuccessResponse(`Success story ${isPublish ? "published" : "unpublished"} successfully`, { successStory: updatedSuccessStory });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
