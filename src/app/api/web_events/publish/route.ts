import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import WebEventsModel from "@/models/web/webEvents.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { eventId, isPublish } = body;

        // Validate input
        if (!eventId || typeof isPublish !== "boolean") {
            return sendErrorResponse("Missing or invalid fields: eventId or isPublish", 200);
        }

        // Find and update 
        const updatedEvent = await WebEventsModel.findOneAndUpdate(
            { id: eventId },
            { isPublish },
            { new: true }
        );

        if (!updatedEvent) {
            return sendErrorResponse("Event not found", 200);
        }

        return sendSuccessResponse(`Event ${isPublish ? "published" : "unpublished"} successfully`, { event: updatedEvent });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
