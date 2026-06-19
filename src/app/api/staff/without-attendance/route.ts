import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/common/gender.model";
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

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];

        // Use Mongoose aggregation to find staff without attendance
        const staff = await StaffModel.aggregate([
            {
                $lookup: {
                    from: "attendances", // Name of the Attendance collection in the database
                    localField: "id", // Staff id in the Staff collection
                    foreignField: "staffId", // Staff id in the Attendance collection
                    as: "attendanceRecords",
                },
            },
            {
                $match: {
                    $or: [
                        { attendanceRecords: { $size: 0 } }, // No attendance record
                        { "attendanceRecords.date": { $ne: today } }, // No attendance for today
                    ],
                },
            },
            {
                $project: {
                    _id: 0, // Exclude MongoDB _id
                    id: 1, // Include id
                    fullName: 1, // Include fullName
                    firstName: 1,
                    lastName: 1,
                },
            },
        ]);

        return sendSuccessResponse(`Staff For Attendance - ${today}`, { staff });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}