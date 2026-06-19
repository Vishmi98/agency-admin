import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import AttendanceModel from "@/models/office/attendance.model";
import RosterModel from "@/models/office/roster.model";
import StaffModel from "@/models/office/staff.model";
import ShiftModel from "@/models/office/shift.model";
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

        const body = await req.json();
        const { date } = body;

        if (!date || typeof date !== "string") {
            return sendErrorResponse("Invalid or missing date", 200);
        }

        const rosters = await RosterModel.find({ date }).select(
            "-_id -__v -createDate -updatedDate"
        );

        if (!rosters.length) {
            return sendSuccessResponse("No rosters found for this date", []);
        }

        const attendanceRecords = await AttendanceModel.find({ date })
            .select("-_id -__v -createDate -updatedDate")
            .exec();

        const attendanceMap = new Map();

        if (Array.isArray(attendanceRecords)) {
            attendanceRecords.forEach((record) =>
                attendanceMap.set(record.staffId, record)
            );
        }

        const staffIds = rosters.map((r) => r.staffId);
        const shiftIds = rosters.map((r) => r.shiftId);

        const staffData = await StaffModel.find({ id: { $in: staffIds } })
            .select("id fullName -_id")
            .exec();

        const staffMap = new Map(staffData.map((s) => [s.id, s.fullName]));

        const shiftData = await ShiftModel.find({ id: { $in: shiftIds } })
            .select("id name startTime endTime -_id")
            .exec();

        const shiftMap = new Map(shiftData.map((s) => [s.id, s]));

        const formattedRosters = rosters.map((roster, index) => ({
            id: index + 1,
            staffId: roster.staffId,
            name: staffMap.get(roster.staffId) || "Unknown",
            startTime: attendanceMap.get(roster.staffId)?.inTime || "",
            endTime: attendanceMap.get(roster.staffId)?.outTime || "",
            attendanceId: attendanceMap.get(roster.staffId)?.id || "",
            shiftId: roster.shiftId,
            shiftInfo: shiftMap.get(roster.shiftId) || {},
        }));

        return sendSuccessResponse("Rosters retrieved successfully!", formattedRosters);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
