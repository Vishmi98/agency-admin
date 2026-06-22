import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import StaffModel from "@/models/office/staff.model";
import { authenticate } from "@/lib/authenticate";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const body = await req.json();

        const decryptedBody = decryptData(body.payload || "");

        const { staffId, isActive } = decryptedBody;

        if (typeof staffId !== "number" || typeof isActive !== "boolean") {
            return sendErrorResponse("Invalid parameters", 200);
        }

        const updated = await StaffModel.findOneAndUpdate(
            { id: staffId },
            {
                isActive,
                updatedDate: new Date(),
            },
            { new: true }
        );

        if (!updated) {
            return sendErrorResponse("Staff not found", 200);
        }

        const statusText = isActive ? "activated" : "deactivated";

        // 🔐 ENCRYPT RESPONSE
        const encryptedResponse = encryptData({
            staff: updated,
            status: statusText,
        });

        return sendSuccessResponse(
            `Successfully ${statusText} the staff member`,
            encryptedResponse
        );
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
