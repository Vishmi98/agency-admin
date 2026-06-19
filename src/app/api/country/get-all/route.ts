import { NextRequest } from "next/server";

import { authenticate } from "@/lib/authenticate";
import { connectDB } from "@/lib/mongodb";
import CountryModel from "@/models/common/country.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const countries = await CountryModel.find()
            .select("-_id -__v -createDate -updatedDate")

        return sendSuccessResponse("Countries fetched successfully", { countries });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
