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
        const { staffId, isAttendanceMatter } = body;

        if (typeof staffId !== "number" || typeof isAttendanceMatter !== "boolean") {
            return sendErrorResponse("Invalid parameters", 200);
        }

        const updated = await StaffModel.findOneAndUpdate(
            { id: staffId },
            {
                isAttendanceMatter,
                updatedDate: new Date(),
            },
            { new: true }
        );

        if (!updated) {
            return sendErrorResponse("Staff not found", 200);
        }

        return sendSuccessResponse("Attendance Matter status updated successfully", { staff: updated });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
