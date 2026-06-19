import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
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

        const body = await req.json();
        const {
            name,
            address,
            countryId,
            phoneNumber,
            email,
            staffId,
            rank,
            code,
        } = body;

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

        return sendSuccessResponse("University created successfully", { university });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
