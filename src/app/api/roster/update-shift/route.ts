import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/office/shift.model";
import "@/models/office/staff.model";
import RosterModel from "@/models/office/roster.model";
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
            rosterId,
            date,
            staffId,
            shiftId
        }: {
            rosterId: string,
            date: string,
            staffId: number,
            shiftId: number,
        } = body;

        if (!rosterId || !date || !staffId || shiftId == null) {
            return sendErrorResponse("Missing required fields", 200);
        }

        const updatedRoster = await RosterModel.findOneAndUpdate(
            { rosterId, date, staffId },
            { shiftId, updatedDate: new Date() },
            { new: true }
        )
            .select("-_id -__v -createDate -updatedDate")
            .populate("staffInfo", "fullName -_id")
            .populate("shiftInfo", "id name startTime endTime -_id")
            .exec();

        if (!updatedRoster) {
            return sendErrorResponse("Roster not found for update", 200);
        }

        return sendSuccessResponse("Roster updated successfully", updatedRoster);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
