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
            staffId,
            date
        }: {
            rosterId: string,
            staffId: number,
            date: string,
        } = body;

        const roster = await RosterModel.findOne({ rosterId, date, staffId })
            .select("-_id -__v -createDate -updatedDate")
            .populate("staffInfo", "fullName -_id")
            .populate("shiftInfo", "id name startTime endTime -_id")
            .exec();
        if (!roster) {
            return sendErrorResponse("Roster not found", 200);
        }

        return sendSuccessResponse("Roster retrieved successfully", roster);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
