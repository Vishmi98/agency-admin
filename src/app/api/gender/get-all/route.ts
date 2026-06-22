import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import GenderModel from "@/models/common/gender.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));

        const decryptedBody = decryptData(body.payload || "");

        // (optional) if you ever pass filters later
        const { } = decryptedBody;

        const genders = await GenderModel.find()
            .select("-_id -__v -createDate -updatedDate")

        const encryptedResponse = encryptData({
            genders,
        });

        return sendSuccessResponse("OK", encryptedResponse);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
