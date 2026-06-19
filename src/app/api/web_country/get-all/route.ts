import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/web/webUniversity.model";
import WebCountryModel from "@/models/web/webCountry.model";
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

        const countries = await WebCountryModel.find()
            .select('-_id -createDate -updatedDate -__v')
            .populate({
                path: 'universitiesInfo',
                select: 'id name code phone email address city country internationalStudentCount livingCost currency ranking overview universityWebsite coverImage courses logo url -_id',
            });

        return sendSuccessResponse("Countries fetched successfully", { countries });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
