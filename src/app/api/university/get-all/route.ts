import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/common/country.model";
import "@/models/office/staff.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import UniversityModel from "@/models/university/university.model";
import { authenticate } from "@/lib/authenticate";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    try {
        await connectDB();

        const body = await req.json();

        const decryptedBody = decryptData(body.payload || "");

        const {
            page = 1,
            limit = 10,
        } = decryptedBody;

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

        const encryptedResponse = encryptData({
            universities,
            page,
            limit,
            totalPages: Math.ceil(
                totalUniversities / limit
            ),
            totalUniversities
        });

        return sendSuccessResponse("OK", encryptedResponse);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}