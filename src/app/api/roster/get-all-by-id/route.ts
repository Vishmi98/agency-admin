import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/office/shift.model";
import "@/models/office/staff.model";
import RosterModel from "@/models/office/roster.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import MonthModel, { IDateEntry, IMonth } from "@/models/office/month.model";
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
        const { rosterId, month }: { rosterId?: string; month?: string } = body;

        if (!rosterId || typeof rosterId !== "string") {
            return sendErrorResponse("Invalid or missing rosterId", 200);
        }

        if (!month || typeof month !== "string") {
            return sendErrorResponse("Invalid or missing month", 200);
        }

        const rosters = await RosterModel.find({ rosterId })
            .select("-_id -__v -createDate -updatedDate")
            .populate("staffInfo", "fullName -_id")
            .populate("shiftInfo", "id name startTime endTime -_id");

        if (rosters.length === 0) {
            return sendErrorResponse("Rosters not found", 200);
        }

        // const monthData = await MonthModel.findOne({ month }).select("dates -_id") as IMonth | null;

        // if (!monthData || !Array.isArray(monthData.dates)) {
        //     return sendErrorResponse("Month data not found or invalid", 404);
        // }

        const monthData = await MonthModel.findOne({ month })
            .select("dates -_id")
            .lean<IMonth>()
            .exec();

        if (!monthData || !Array.isArray(monthData.dates)) {
            return sendErrorResponse("Month data not found or invalid", 200);
        }

        const holidays = monthData.dates.filter((date: IDateEntry) => date.isHoliday === true);

        return sendSuccessResponse("Roster retrieved successfully", {
            rosters,
            holidays,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
