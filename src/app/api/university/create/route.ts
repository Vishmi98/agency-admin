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
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    try {
        await connectDB();

        const body = await req.json();

        const decryptedBody = decryptData(
            body.payload
        );

        const {
            name,
            address,
            countryId,
            phoneNumber,
            email,
            staffId,
            rank,
            code,
        } = decryptedBody;

        if (!name || !address || !countryId || !phoneNumber || !staffId || !rank || !code) {
            return sendErrorResponse("Missing required fields", 200);
        }

        const existingUniversity = await UniversityModel.findOne({
            $or: [{ name }, { code }],
        });

        if (existingUniversity) {
            return sendErrorResponse("University with the same name or code already exists", 200);
        }

        let id = 100;
        const lastUni = await UniversityModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
        if (lastUni) {
            id = lastUni.id + 1;
        }

        const university = await UniversityModel.create({
            id,
            name,
            address,
            countryId,
            phoneNumber,
            email,
            isPublish: false,
            staffId,
            rank,
            code,
            createdDate: new Date()
        });

        const encryptedResponse = encryptData({
            university,
        });

        return sendSuccessResponse(
            "University created successfully!",
            encryptedResponse
        );
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
