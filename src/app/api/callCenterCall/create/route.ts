import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import CallCenterCallModel from "@/models/office/callCenterCall.model";
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
        const {
            name,
            phone,
            from,
            note,
            qualification,
            successPercentage,
            createBy,
            checkBy,
        } = body;

        if (!name || !phone || !from || !qualification || successPercentage === undefined) {
            return sendErrorResponse("Missing required fields", 200);
        }

        const latest = await CallCenterCallModel.findOne().sort({ id: -1 });
        const newId = latest ? latest.id + 1 : 1;

        const newCall = await CallCenterCallModel.create({
            id: newId,
            name,
            phone,
            from,
            note,
            qualification,
            successPercentage,
            createBy,
            checkBy,
            createdDate: new Date(),
        });

        return sendSuccessResponse("Successfully created call record", newCall);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
