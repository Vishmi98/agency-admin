import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import RosterModel from "@/models/office/roster.model";
import AttendanceModel from "@/models/office/attendance.model";
import ShiftModel from "@/models/office/shift.model";
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

        const body = await req.json().catch(() => ({}));
        const { userId, date }: { userId?: number; date?: string } = body;

        if (!userId || typeof userId !== "number") {
            return sendErrorResponse("Invalid or missing userId", 200);
        }
        if (!date || typeof date !== "string") {
            return sendErrorResponse("Invalid or missing date", 200);
        }

        const rosterData = await RosterModel.findOne({
            staffId: userId,
            date: date,
        }).select("-_id");

        const attendanceData = await AttendanceModel.findOne({
            staffId: userId,
            date: date,
        }).select("-_id -__v -createDate -updatedDate");

        const shiftData = await ShiftModel.findOne({
            id: rosterData?.shiftId,
        }).select("-_id");

        const staffData = await StaffModel.findOne({
            id: userId,
        }).select("-_id");

        if (!rosterData && !attendanceData) {
            return sendErrorResponse("Roster not found", 200);
        }

        const resData = {
            staffId: rosterData?.staffId,
            date: rosterData?.date,
            name: staffData?.fullName,
            startTime: attendanceData?.inTime,
            endTime: attendanceData?.outTime,
            shiftId: rosterData?.shiftId,
            attendanceId: attendanceData?.id,
            shiftInfo: shiftData,
        };

        return sendSuccessResponse("Roster retrieved successfully", resData);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
