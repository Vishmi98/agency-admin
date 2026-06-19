import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";
import WebAwardModel from "@/models/web/webAward.model";


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

        const awards = await WebAwardModel.find()
            .skip(skip)
            .limit(limit)
            .select("-_id -__v -createdAt -updatedAt")
            .sort({ createdAt: -1 })
            .exec();

        const totalAwards = await WebAwardModel.countDocuments();

        return sendSuccessResponse("Awards retrieved successfully", {
            page,
            limit,
            totalPages: Math.ceil(totalAwards / limit),
            totalAwards,
            awards,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}