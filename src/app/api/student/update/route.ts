import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { StudentModel } from "@/models/student/student.model";
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
        const { id, ...updatedData } = body;

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

        return sendSuccessResponse("Student updated successfully", { student: updatedStudent });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
