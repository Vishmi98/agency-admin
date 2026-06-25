import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import UniversityModel from "@/models/university/university.model";
import { authenticate } from "@/lib/authenticate";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";

export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult;

    try {
        await connectDB();

        const body = await req.json();

        const decryptedBody = decryptData(body.payload || "");

        const {
            id,
            name,
            address,
            countryId,
            phoneNumber,
            email,
            staffId,
            rank,
            code,
            website
        } = decryptedBody;

        // 🔴 Validate required fields
        if (
            !id ||
            !name ||
            !address ||
            !countryId ||
            !phoneNumber ||
            !staffId ||
            !rank ||
            !code
        ) {
            return sendErrorResponse("Missing required fields", 200);
        }

        // 🔴 Check if university exists
        const existingUniversity = await UniversityModel.findOne({ id });

        if (!existingUniversity) {
            return sendErrorResponse("University not found", 200);
        }

        // 🔴 Check duplicate name/code (exclude current record)
        const duplicate = await UniversityModel.findOne({
            id: { $ne: id },
            $or: [{ name }, { code }],
        });

        if (duplicate) {
            return sendErrorResponse(
                "University with the same name or code already exists",
                200
            );
        }

        // 🔄 Update university
        const updatedUniversity = await UniversityModel.findOneAndUpdate(
            { id },
            {
                name,
                address,
                countryId,
                phoneNumber,
                email,
                staffId,
                rank,
                code,
                website
            },
            { new: true }
        )
            .populate({ path: "countryInfo", select: "id title -_id" })
            .populate({
                path: "staffInfo",
                select: "id firstName lastName -_id",
            });

        const encryptedResponse = encryptData({
            university: updatedUniversity,
        });

        return sendSuccessResponse(
            "University updated successfully!",
            encryptedResponse
        );
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}