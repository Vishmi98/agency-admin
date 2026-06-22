import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { authenticate } from "@/lib/authenticate";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import InquiryModel from "@/models/common/inquiry.model";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";

export async function POST(req: NextRequest) {
    const auth = await authenticate(req);
    if (auth instanceof Response) return auth;

    try {
        await connectDB();

        const body = await req.json();

        const decryptedBody = decryptData(body.payload || "");

        const {
            page = 1,
            limit = 10,
            search = "",
        } = decryptedBody;

        const skip = (page - 1) * limit;

        const inquiries = await InquiryModel.find({})
            .sort({ createDate: -1 })
            .skip(skip)
            .limit(limit);

        const totalInquiries = await InquiryModel.countDocuments();

        const encryptedResponse = encryptData({
            inquiries,
            page,
            limit,
            totalPages: Math.ceil(
                totalInquiries / limit
            ),
            totalInquiries
        });

        return sendSuccessResponse("OK", encryptedResponse);
    } catch (error) {
        return sendErrorResponse("Server error", 500);
    }
}

// headers: {
//     "Content-Type": "application/json",
//     "x-api-key": CLIENT_ABC_123 || "",
// },