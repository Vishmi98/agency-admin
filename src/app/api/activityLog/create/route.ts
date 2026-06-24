import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ActivityLogModel from "@/models/common/activityLog.model";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        // 🔐 decrypt incoming payload
        const decryptedBody = decryptData(body.payload);

        const {
            userId,
            action,
            endpoint,
            path,
            method,
            meta,
        } = decryptedBody;

        if (!userId || !action) {
            return sendErrorResponse("Missing required fields", 200);
        }

        await ActivityLogModel.create({
            userId,
            action,
            endpoint,
            path,
            method,
            meta,
        });

        // 🔐 encrypt response
        const encryptedResponse = encryptData(true);

        return sendSuccessResponse("Logged", encryptedResponse);

    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}