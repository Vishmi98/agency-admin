import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import StaffModel from "@/models/office/staff.model";
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
        const { staffId, basicSalary } = body;

        if (typeof staffId !== "number" || typeof basicSalary !== "number") {
            return sendErrorResponse("Invalid input: staffId and basicSalary must be numbers", 200);
        }

        const staff = await StaffModel.findOne({ id: staffId });

        if (!staff) {
            return sendErrorResponse("Staff not found", 200);
        }

        staff.basicSalary = basicSalary;
        await staff.save();

        return sendSuccessResponse("Basic salary updated successfully");
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
