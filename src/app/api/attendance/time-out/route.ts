import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import AttendanceModel from "@/models/office/attendance.model";
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
        const { id, staffId, outTime } = body;

        if (!id || !staffId || !outTime) {
            return sendErrorResponse("Missing required fields: id, staffId, or outTime", 200);
        }

        const attendance = await AttendanceModel.findOneAndUpdate(
            { id: id, staffId: staffId }, // Query object to find the document
            { $set: { outTime } }, // Update the specified fields
            { new: true } // Option to return the updated document
        );

        if (!attendance) {
            return sendErrorResponse("Attendance record not found", 200);
        }

        return sendSuccessResponse("Out time added successfully", { attendance });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
