import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/office/staff.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import CallCenterCallModel from "@/models/office/callCenterCall.model";
import { authenticate } from "@/lib/authenticate";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const {
            page = 1,
            limit = 10,
        }: {
            page?: number;
            limit?: number;
        } = body;

        const skip = (page - 1) * limit;

        const calls = await CallCenterCallModel.find().sort({ createDate: -1 })
            .skip(skip)
            .limit(limit)
            .select("-_id -__v -createDate -updatedDate")
            .populate({ path: "creatorInfo", select: "id firstName lastName -_id" })
            .populate({ path: "checkerInfo", select: "id firstName lastName -_id" });

        const totalCalls = await CallCenterCallModel.countDocuments();

        return sendSuccessResponse("Records retrieved successfully", {
            page,
            limit,
            totalPages: Math.ceil(totalCalls / limit),
            totalCalls,
            calls,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}