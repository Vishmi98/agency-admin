import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";
import SuccessStory from "@/models/web/successStory.model";


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

        const successStories = await SuccessStory.find()
            .skip(skip)
            .limit(limit)
            .select("-_id -__v -createdAt -updatedAt")
            .sort({ createdAt: -1 })
            .exec();

        const totalSuccessStories = await SuccessStory.countDocuments();

        return sendSuccessResponse("SuccessStories retrieved successfully", {
            page,
            limit,
            totalPages: Math.ceil(totalSuccessStories / limit),
            totalSuccessStories,
            successStories,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}