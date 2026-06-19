import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import WebCountryModel from "@/models/web/webCountry.model";
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

        const body = await req.json();
        const {
            country,
            image,
            title,
            shortDescription,
            popularity,
            advantage1,
            advantage2,
            advantage3,
            advantage4,
            advantage5,
            requirement1,
            requirement2,
            requirement3,
            requirement4,
            requirement5,
            cost1,
            cost2,
            cost3,
            cost4,
            scholarships1,
            scholarships2,
            scholarships3,
            scholarships4,
            universities,
            url
        } = body;

        if (!country || !shortDescription || !url) {
            return sendErrorResponse("Missing required fields", 200);
        }

        const existingCountry = await WebCountryModel.findOne({
            $or: [{ country }, { url }],
        });

        if (existingCountry) {
            if (existingCountry.country === country) {
                return sendErrorResponse('A country with this name already exists', 200);
            }
            if (existingCountry.url === url) {
                return sendErrorResponse('A country with this URL already exists', 200);
            }
        }

        let id = 100;

        const lastRecord = await WebCountryModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);

        if (lastRecord) {
            id = lastRecord.id + 1
        }

        const newCountry = await WebCountryModel.create({
            id,
            country,
            image,
            title,
            shortDescription,
            popularity,
            advantage1,
            advantage2,
            advantage3,
            advantage4,
            advantage5,
            requirement1,
            requirement2,
            requirement3,
            requirement4,
            requirement5,
            cost1,
            cost2,
            cost3,
            cost4,
            scholarships1,
            scholarships2,
            scholarships3,
            scholarships4,
            universities,
            url,
            createDate: new Date(),
            updatedDate: new Date(),
        });

        return sendSuccessResponse('Country created successfully!', { country: newCountry });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
