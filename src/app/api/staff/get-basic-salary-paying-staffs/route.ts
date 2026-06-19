import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/common/gender.model";
import "@/models/common/title.model";
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
        const {
            page = 1,
            limit = 10,
        }: {
            page?: number;
            limit?: number;
        } = body;

        const skip = (page - 1) * limit;
        const filter = { isBasicSalaryPay: true };

        const staffs = await StaffModel.find(filter)
            .skip(skip)
            .limit(limit)
            .select("-_id -__v -facebookId -googleId -authProvider")
            .populate("titleInfo", "title -_id")
            .populate("genderInfo", "title -_id")
            .sort({ createDate: -1 })
            .exec();

        const totalStaffs = await StaffModel.countDocuments(filter);

        return sendSuccessResponse("Staffs retrieved successfully", {
            page,
            limit,
            totalPages: Math.ceil(totalStaffs / limit),
            totalStaffs,
            staffs,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}