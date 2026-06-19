import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
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
            date,
            staffId,
            inTime,
            createdBy
        }: {
            date: string;
            staffId: number;
            inTime: string;
            createdBy: number;
        } = body;

        if (!date || !staffId || !inTime) {
            return sendErrorResponse("Missing required fields", 200);
        }

        const existingRecord = await AttendanceModel.findOne({ date, staffId });
        if (existingRecord) {
            return sendErrorResponse("Attendance record already exists for this staff on this date", 200);
        }

        let id = 100;
        const lastRow = await AttendanceModel.findOne({}, { id: 1 }).sort({ id: -1 });
        if (lastRow) {
            id = lastRow.id + 1;
        }

        const attendance = await AttendanceModel.create({
            id,
            date,
            staffId,
            inTime,
            outTime: "",
            leave: "",
            createdBy,
        });

        return sendSuccessResponse("In time added successfully", { attendance });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
