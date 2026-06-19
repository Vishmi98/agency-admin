import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import RosterModel from "@/models/office/roster.model";
import MonthModel from "@/models/office/month.model";
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
        const { rosters } = body;

        if (!Array.isArray(rosters) || rosters.length === 0) {
            return sendErrorResponse("Invalid roster data provided", 200);
        }

        const savedRosters = await RosterModel.insertMany(rosters);

        const uniqueMonths = new Set(
            rosters.map((r) => r.date.substring(0, 7))
        );

        await MonthModel.updateMany(
            { month: { $in: Array.from(uniqueMonths) } },
            { $set: { isRosterCreated: true } }
        );

        return sendSuccessResponse("Successfully created roster!", { savedRosters });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
