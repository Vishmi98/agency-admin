import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";
import StaffModel from "@/models/office/staff.model";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    try {
        await connectDB();

        const body = await req.json();
        const decryptedBody = decryptData(body.payload || body);

        const { id, ...updatedData } = decryptedBody;

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

        const encryptedResponse = encryptData({
            staff: updatedStaff
        });

        return sendSuccessResponse("Staff updated successfully", encryptedResponse);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
