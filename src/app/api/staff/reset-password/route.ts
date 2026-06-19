import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { resetStaffPassword } from "@/services/staff.service";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";

export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    try {
        await connectDB();

        const { staffId, newPassword } = await req.json();

        if (!staffId || !newPassword) {
            return sendErrorResponse("Staff ID and new password are required", 400);
        }

        const updatedStaff = await resetStaffPassword(Number(staffId), newPassword);

        if (!updatedStaff) {
            return sendErrorResponse("Staff not found", 404);
        }

        return sendSuccessResponse("Password reset successfully!");
    } catch (error) {
        console.error("Reset password error:", error);
        return sendErrorResponse("Server error", 500);
    }
}
