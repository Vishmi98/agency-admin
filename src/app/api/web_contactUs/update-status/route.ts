import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ContactUsModel from "@/models/web/contactUs.model";
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
        const { id, status } = body;

        if (!Number.isInteger(id) || !Number.isInteger(status) || id <= 0) {
            return sendErrorResponse("Invalid parameters", 200);
        }

        const updated = await ContactUsModel.findOneAndUpdate(
            { id },
            {
                status,
                updatedDate: new Date(),
            },
            { new: true }
        );

        if (!updated) {
            return sendErrorResponse("Lead not found", 200);
        }

        return sendSuccessResponse("Lead updated successfully", { updated });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
