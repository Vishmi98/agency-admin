import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { authenticate } from "@/lib/authenticate";
import { createMainCommission } from "@/utils/common.util";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();
        const body = await req.json();
        const { date, invoiceId, percentage } = body;

        if (!invoiceId || !percentage) {
            return sendErrorResponse("Missing required fields", 200);
        }

        // 2. Call service
        const { commission, subCommissions } = await createMainCommission(
            invoiceId,
            percentage,
            date,
            false,
            "pending"
        );

        return sendSuccessResponse("Commission added successfully!", {
            commission,
            subCommissions,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
