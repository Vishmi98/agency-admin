import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import SuccessStory from "@/models/web/successStory.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { id } = body; // numeric custom ID

        if (!id) {
            return sendErrorResponse("ID is required", 200);
        }

        // Use your custom numeric id field, NOT _id
        const deletedStory = await SuccessStory.findOneAndDelete({ id: Number(id) });

        if (!deletedStory) {
            return sendErrorResponse("Success story not found", 200);
        }

        return sendSuccessResponse("Success story deleted successfully", { successStory: deletedStory });
    } catch (error) {
        console.error(error);
        return sendErrorResponse("Server error", 200);
    }
}
