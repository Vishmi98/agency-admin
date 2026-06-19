import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import VistaStatusModel from "@/models/common/visaStatus.model";
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
        const { title } = body;

        if (!title?.SN || !title?.EN || !title?.TM) {
            return sendErrorResponse("Missing required fields in visaStatusType", 200);
        }

        const existing = await VistaStatusModel.findOne({
            $or: [
                { "title.SN": title.SN },
                { "title.EN": title.EN },
                { "title.TM": title.TM },
            ],
        });

        if (existing) {
            return sendErrorResponse("Student status type with the same title already exists", 200);
        }

        let id = 1;
        const lastRecord = await VistaStatusModel.findOne({}, { id: 1 })
            .sort({ id: -1 })
            .limit(1);

        if (lastRecord) {
            id = lastRecord.id + 1;
        }

        const visaStatusType = await VistaStatusModel.create({ id, title });

        return sendSuccessResponse("Visa status type created successfully!", { visaStatusType });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
