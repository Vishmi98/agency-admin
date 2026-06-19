import { NextRequest } from "next/server";

import { authenticate } from "@/lib/authenticate";
import { connectDB } from "@/lib/mongodb";
import VistaStatusModel from "@/models/common/visaStatus.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const visaStatusTypes = await VistaStatusModel.find()
            .select("-_id -__v -createDate -updatedDate")

        return sendSuccessResponse("Visa status types fetched successfully", { visaStatusTypes });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
