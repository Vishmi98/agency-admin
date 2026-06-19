import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/office/shift.model";
import MonthModel from "@/models/office/month.model";
import StaffModel from "@/models/office/staff.model";
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

        const body = await req.json().catch(() => ({}));
        const { month } = body;

        if (!month || typeof month !== "string") {
            return sendErrorResponse("Invalid or missing month", 200);
        }

        // Fetch month data
        const monthData = await MonthModel.findOne({ month }).select(
            "-_id -__v -createDate -updatedDate"
        ).lean();

        if (!monthData) {
            return sendErrorResponse("Month not found", 200);
        }

        // Fetch staff where isAttendanceMatter === true
        const staffData = await StaffModel.find({ isAttendanceMatter: true }).lean();

        if (!staffData.length) {
            return sendErrorResponse("Staff not found", 200);
        }

        return sendSuccessResponse("Data retrieved successfully", { monthData, staffData });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
