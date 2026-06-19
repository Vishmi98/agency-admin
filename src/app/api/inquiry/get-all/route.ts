import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { authenticate } from "@/lib/authenticate";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import InquiryModel from "@/models/common/inquiry.model";

export async function POST(req: NextRequest) {
    const auth = await authenticate(req);
    if (auth instanceof Response) return auth;

    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));

        const {
            page = 1,
            limit = 10,
            search = "",
        }: {
            page?: number;
            limit?: number;
            search?: string;
        } = body;

        const skip = (page - 1) * limit;

        const inquiries = await InquiryModel.find({})
            .sort({ createDate: -1 })
            .skip(skip)
            .limit(limit);

        const totalInquiries = await InquiryModel.countDocuments();

        return sendSuccessResponse("Inquiries fetched", {
            page,
            limit,
            totalPages: Math.ceil(totalInquiries / limit),
            totalInquiries,
            inquiries,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 500);
    }
}

// headers: {
//     "Content-Type": "application/json",
//     "x-api-key": CLIENT_ABC_123 || "",
// },