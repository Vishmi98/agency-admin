import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import WebUniversityModel from "@/models/web/webUniversity.model";
import "@/models//web/webCountry.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const universities = await WebUniversityModel.find()
            .select("-_id -__v -createDate -updatedDate")
            .populate({ path: "countryInfo", select: "id country -_id" });

        return sendSuccessResponse("Universities fetched successfully", { universities });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
