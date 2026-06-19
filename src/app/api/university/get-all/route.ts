import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/common/country.model";
import "@/models/office/staff.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import UniversityModel from "@/models/university/university.model";
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

        const universities = await UniversityModel.find()
            .skip(skip)
            .limit(limit)
            .select("-_id -createdDateTime -__v")
            .populate({ path: "countryInfo", select: "id title -_id" })
            .populate({
                path: "staffInfo",
                select: "id firstName lastName -_id",
            })
            .sort({ createdDate: -1 })
            .exec();

        const totalUniversities = await UniversityModel.countDocuments();

        return sendSuccessResponse("Universities retrieved successfully", {
            page,
            limit,
            totalPages: Math.ceil(totalUniversities / limit),
            totalUniversities,
            universities,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}