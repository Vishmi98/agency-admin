import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/office/staff.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";
import ActivityLogModel from "@/models/common/activityLog.model";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    try {
        await connectDB();

        const body = await req.json();

        const decryptedBody = decryptData(body.payload || "");

        const {
            page = 1,
            limit = 10,
        } = decryptedBody;

        const skip = (page - 1) * limit;

        const logs = await ActivityLogModel.find()
            .skip(skip)
            .limit(limit)
            .select("-_id -createdDateTime -__v")
            .populate({
                path: "userInfo",
                select: "-_id",
            })
            .sort({ createdAt: -1 })
            .exec();

        const totalLogs = await ActivityLogModel.countDocuments();

        const encryptedResponse = encryptData({
            logs,
            page,
            limit,
            totalPages: Math.ceil(
                totalLogs / limit
            ),
            totalLogs
        });

        return sendSuccessResponse("OK", encryptedResponse);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}