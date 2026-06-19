import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";
import StaffModel from "@/models/office/staff.model";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const body = await req.json();
        const { id, ...updatedData } = body;

        if (typeof id !== "number") {
            return sendErrorResponse("Invalid or missing staff ID", 200);
        }

        const updatedStaff = await StaffModel.findOneAndUpdate(
            { id },
            { ...updatedData, updatedDate: new Date() },
            { new: true, runValidators: true }
        ).select("-_id -__v -password");

        if (!updatedStaff) {
            return sendErrorResponse("Staff not found", 200);
        }

        return sendSuccessResponse("Staff updated successfully", { staff: updatedStaff });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
