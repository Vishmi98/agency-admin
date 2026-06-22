import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import LeadStatusModel from "@/models/common/leadStatus.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { decryptData } from "@/lib/decrypt";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));

        const decryptedBody = decryptData(body.payload || "");

        // (optional) if you ever pass filters later
        const { } = decryptedBody;

        const leadStatuses = await LeadStatusModel.find()
            .select("-_id -__v -createDate -updatedDate")

        return sendSuccessResponse("Lead statuses fetched successfully", { leadStatuses });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
