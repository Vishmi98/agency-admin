import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import PackageModel from "@/models/university/package.model";
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
            title,
            countryId,
            uniId,
            courseName,
            cost,
            price,
            startDate,
            qualification,
            duration,
            nextIntake,
            entryQualification,
            studyType,
            language,
            createdBy,
            costInLkr,
            priceInLkr,
        } = body;

        if (!title || !countryId || !uniId) {
            return sendErrorResponse("Missing required fields", 200);
        }

        const existingPackage = await PackageModel.findOne({
            $or: [{ title }, { courseName }],
        });

        if (existingPackage) {
            return sendErrorResponse("Package with the same title or courseName already exists", 200);
        }

        let id = 100;
        const lastPackage = await PackageModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
        if (lastPackage) {
            id = lastPackage.id + 1;
        }

        const newPackage = await PackageModel.create({
            id,
            title,
            countryId,
            uniId,
            courseName,
            cost,
            price,
            startDate,
            qualification,
            duration,
            nextIntake,
            entryQualification,
            studyType,
            language,
            createdBy,
            costInLkr,
            priceInLkr,
            createDate: new Date(),
            updatedDate: new Date(),
        });

        return sendSuccessResponse("Package created successfully", { package: newPackage });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
