import { NextRequest } from "next/server";

import "@/models/university/university.model";
import "@/models/student/student.model";
import "@/models/university/package.model";
import "@/models/common/branch.model";
import "@/models/office/staff.model";

import { connectDB } from "@/lib/mongodb";
import { authenticate } from "@/lib/authenticate";
import MainCommissionModel from "@/models/office/mainCommission.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult;

    try {
        await connectDB();

        const body = await req.json();
        const { commissionId } = body;

        // Find the commission by id
        const commission = await MainCommissionModel.findOne({ id: commissionId });

        if (!commission) {
            return sendErrorResponse("Commission not found", 200);
        }

        // Only update if status is currently "pending"
        if (commission.status !== "pending") {
            return sendErrorResponse("Commission is not in pending status", 200);
        }

        // Update the status
        commission.status = "available";
        await commission.save();

        return sendSuccessResponse("Commission status updated to available", { commission });
    } catch (error: any) {
        console.error(error);
        return sendErrorResponse("Server error", 200);
    }
}
