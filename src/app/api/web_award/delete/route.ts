import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import WebAwardModel from "@/models/web/webAward.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { id } = body; // numeric custom ID

        if (!id) {
            return sendErrorResponse("ID is required", 200);
        }

        // Use your custom numeric id field, NOT _id
        const deletedAward = await WebAwardModel.findOneAndDelete({ id: Number(id) });

        if (!deletedAward) {
            return sendErrorResponse("Award not found", 200);
        }

        return sendSuccessResponse("Award deleted successfully", { award: deletedAward });
    } catch (error) {
        console.error(error);
        return sendErrorResponse("Server error", 200);
    }
}
