import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ExtraPaymentModel from "@/models/invoice/extraPayment.model";
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
        const { title, amount, currency } = body;

        if (!title?.SN || !title?.EN || !title?.TM) {
            return sendErrorResponse("Missing title in all required languages (SN, EN, TM)", 200);
        }
        if (typeof amount !== "number" || amount <= 0) {
            return sendErrorResponse("Amount must be a positive number", 200);
        }
        if (!currency || typeof currency !== "string") {
            return sendErrorResponse("Currency is required and must be a string", 200);
        }

        const existing = await ExtraPaymentModel.findOne({
            $or: [
                { "title.SN": title.SN },
                { "title.EN": title.EN },
                { "title.TM": title.TM },
            ],
        });

        if (existing) {
            return sendErrorResponse("Extra payment with the same title already exists", 200);
        }

        let id = 1;
        const lastRecord = await ExtraPaymentModel.findOne({}, { id: 1 })
            .sort({ id: -1 })
            .limit(1);
        if (lastRecord) {
            id = lastRecord.id + 1;
        }

        const extraPayment = await ExtraPaymentModel.create({
            id,
            title,
            amount,
            currency
        });

        return sendSuccessResponse("Extra payment created successfully!", { extraPayment });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
