import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import WebEventsModel from "@/models/web/webEvents.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { id } = body; // numeric custom ID

        if (!id) {
            return sendErrorResponse("ID is required", 200);
        }

        // Use your custom numeric id field, NOT _id
        const deletedEvent = await WebEventsModel.findOneAndDelete({ id: Number(id) });

        if (!deletedEvent) {
            return sendErrorResponse("Event not found", 200);
        }

        return sendSuccessResponse("Event deleted successfully", { event: deletedEvent });
    } catch (error) {
        console.error(error);
        return sendErrorResponse("Server error", 200);
    }
}
