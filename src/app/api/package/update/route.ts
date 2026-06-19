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
        const { id, costInLkr, priceInLkr } = body;

        if (typeof id !== "number") {
            return sendErrorResponse("Invalid or missing id", 200);
        }

        const existingPackage = await PackageModel.findOne({ id });

        if (!existingPackage) {
            return sendErrorResponse("Package not found", 200);
        }

        if (costInLkr !== undefined) existingPackage.costInLkr = costInLkr;
        if (priceInLkr !== undefined) existingPackage.priceInLkr = priceInLkr;

        existingPackage.updatedDate = new Date();

        await existingPackage.save();

        return sendSuccessResponse("Package updated successfully", { package: existingPackage });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
