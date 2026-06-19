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
            page = 1,
            limit = 10,
        }: {
            page?: number;
            limit?: number;
        } = body;

        const skip = (page - 1) * limit;

        const rosters = await RosterModel.find()
            .skip(skip)
            .limit(limit)
            .select("-_id -__v -createDate -updatedDate")
            .populate("staffInfo", "fullName -_id")
            .populate("shiftInfo", "id name startTime endTime -_id")
            .sort({ createDate: -1 })
            .exec();

        const totalRosters = await RosterModel.countDocuments();

        return sendSuccessResponse("Rosters retrieved successfully", {
            page,
            limit,
            totalPages: Math.ceil(totalRosters / limit),
            totalRosters,
            rosters,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}