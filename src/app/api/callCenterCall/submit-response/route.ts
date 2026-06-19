import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/office/staff.model";
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
        const { callId, response_, checkBy } = body;

        if (!callId || !response_ || !checkBy) {
            return sendErrorResponse("Missing required fields", 200);
        }

        const updatedCall = await CallCenterCallModel.findOneAndUpdate(
            { id: callId },
            {
                response: response_,
                checkBy,
                updatedDate: new Date(),
            },
            { new: true }
        )
            .populate({ path: "creatorInfo", select: "id firstName lastName -_id" })
            .populate({ path: "checkerInfo", select: "id firstName lastName -_id" });

        if (!updatedCall) {
            return sendErrorResponse("Call record not found", 200);
        }

        return sendSuccessResponse("Response submitted successfully", updatedCall);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
