import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/common/leaveType.model";
import "@/models/office/staff.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import AttendanceModel from "@/models/office/attendance.model";
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
        }: {
            page?: number;
            limit?: number;
        } = body;

        const skip = (page - 1) * limit;

        const attendance = await AttendanceModel.find({
            leave: null,
            outTime: "",
        })
            .sort({ createDate: -1 })
            .skip(skip)
            .limit(limit)
            .select("-_id -__v -createDate -updatedDate")
            .populate({ path: "leaveInfo", select: "id title -_id" })
            .populate({ path: "staffInfo", select: "id firstName lastName -_id" });

        const totalAttendance = await AttendanceModel.countDocuments({
            leave: null,
            outTime: "",
        });

        return sendSuccessResponse("Miss out time attendances retrieved successfully", {
            page,
            limit,
            totalPages: Math.ceil(totalAttendance / limit),
            totalAttendance,
            attendance,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}