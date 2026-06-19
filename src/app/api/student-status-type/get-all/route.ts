import { NextRequest } from "next/server";

import { authenticate } from "@/lib/authenticate";
import { connectDB } from "@/lib/mongodb";
import StudentStatusModel from "@/models/common/studentStatus.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const studentStatuses = await StudentStatusModel.find()
            .select("-_id -__v -createDate -updatedDate")

        return sendSuccessResponse("Student statuses fetched successfully", { studentStatuses });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
