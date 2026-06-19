import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import LeadStatusModel from "@/models/common/leadStatus.model";
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
        const { title, color } = body;

        if (!title?.SN || !title?.EN || !title?.TM) {
            return sendErrorResponse("Missing required fields in leadStatus title", 200);
        }

        if (!color || typeof color !== "string") {
            return sendErrorResponse("Missing or invalid 'color' field", 200);
        }

        const existing = await LeadStatusModel.findOne({
            $or: [
                { "title.SN": title.SN },
                { "title.EN": title.EN },
                { "title.TM": title.TM },
            ],
        });

        if (existing) {
            return sendErrorResponse("Lead status with the same title already exists", 200);
        }

        let id = 1;
        const lastRecord = await LeadStatusModel.findOne({}, { id: 1 })
            .sort({ id: -1 })
            .limit(1);

        if (lastRecord) {
            id = lastRecord.id + 1;
        }

        const leadStatus = await LeadStatusModel.create({ id, title, color });

        return sendSuccessResponse("Lead status created successfully!", { leadStatus });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
