import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { StudentModel } from "@/models/student/student.model";
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
        const decryptedBody = decryptData(body.payload || body);

        const { id, ...updatedData } = decryptedBody;

        if (typeof id !== "number") {
            return sendErrorResponse("Invalid or missing student ID", 200);
        }

        const updatedStudent = await StudentModel.findOneAndUpdate(
            { id },
            { ...updatedData, updatedDate: new Date() },
            { new: true, runValidators: true }
        ).select("-_id -__v -password");

        if (!updatedStudent) {
            return sendErrorResponse("Student not found", 200);
        }

        const encryptedResponse = encryptData({
            student: updatedStudent
        });

        return sendSuccessResponse("Student updated successfully", encryptedResponse);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
