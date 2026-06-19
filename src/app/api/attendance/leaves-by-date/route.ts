import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/common/leaveType.model";
import "@/models/office/staff.model";
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
        const {
            page = 1,
            limit = 10,
            date
        }: {
            page?: number;
            limit?: number;
            date: string;
        } = body;

        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(date).getTime())) {
            return sendErrorResponse("Invalid date format. Use YYYY-MM-DD", 400);
        }

        const skip = (page - 1) * limit;

        // Query only records with leave > 0 (exclude 0, null, empty string)
        const query = {
            date: date,
            leave: { $nin: [0, null, ""] }
        };

        const [leaves, totalLeaves] = await Promise.all([
            AttendanceModel.find(query)
                .skip(skip)
                .limit(limit)
                .select("-_id -__v -createDate -updatedDate")
                .populate({ path: "staffInfo", select: "-_id" })
                .populate({ path: "leaveInfo", select: "id title -_id" }),

            AttendanceModel.countDocuments(query),
        ]);

        return sendSuccessResponse("Leaves retrieved successfully", {
            page,
            limit,
            totalPages: Math.ceil(totalLeaves / limit),
            totalLeaves,
            leaves,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
