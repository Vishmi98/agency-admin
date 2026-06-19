import { NextRequest } from "next/server";

import { authenticate } from "@/lib/authenticate";
import { connectDB } from "@/lib/mongodb";
import BranchModel from "@/models/common/branch.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const branches = await BranchModel.find()
            .select("-_id -__v -createDate -updatedDate")

        return sendSuccessResponse("Branches fetched successfully", { branches });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
