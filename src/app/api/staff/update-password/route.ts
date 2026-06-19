// /staff/update-password
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";
import StaffModel from "@/models/office/staff.model";

export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult;

    try {
        await connectDB();

        const body = await req.json();
        const { id, newPassword } = body;

        // Validate input
        if (typeof id !== "number") {
            return sendErrorResponse("Invalid or missing staff ID", 200);
        }
        if (!newPassword || newPassword.length < 6) {
            return sendErrorResponse("Password must be at least 6 characters", 200);
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update staff password
        const updatedStaff = await StaffModel.findOneAndUpdate(
            { id },
            { password: hashedPassword, updatedDate: new Date() },
            { new: true, runValidators: true }
        ).select("-_id -__v -password"); // Don't return password

        if (!updatedStaff) {
            return sendErrorResponse("Staff not found", 200);
        }

        return sendSuccessResponse("Password updated successfully");
    } catch (error) {
        console.error(error);
        return sendErrorResponse("Server error", 200);
    }
}
