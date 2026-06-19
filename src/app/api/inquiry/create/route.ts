import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import InquiryModel from "@/models/common/inquiry.model";

// simple API key check (shared with client)
const VALID_API_KEYS = ["CLIENT_ABC_123", "CLIENT_XYZ_456"];

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const apiKey = req.headers.get("x-api-key");

        if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
            return sendErrorResponse("Unauthorized client", 401);
        }

        const body = await req.json();

        const { firstName, lastName, email, phone, message } = body;

        if (!firstName || !email || !phone || !message) {
            return sendErrorResponse("Missing required fields", 400);
        }

        // auto ID generation
        let id = 1;
        const last = await InquiryModel.findOne({}, { id: 1 }).sort({ id: -1 });
        if (last) id = last.id + 1;

        const inquiry = await InquiryModel.create({
            id,
            firstName,
            lastName,
            email,
            phone,
            message,
            source: "external-client",
            apiKey,
            status: 1,
            createDate: new Date(),
            updatedDate: new Date(),
        });

        return sendSuccessResponse("Inquiry submitted successfully", {
            inquiry,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 500);
    }
}