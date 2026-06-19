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
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();
        const body = await req.json();
        const { commissionId, introduceAmountPaid } = body;

        if (typeof commissionId !== "number" || typeof introduceAmountPaid !== "boolean") {
            return sendErrorResponse("Invalid parameters", 200);
        }

        // 🔹 Find the commission record
        const commission = await MainCommissionModel.findOne({ id: commissionId });
        if (!commission) {
            return sendErrorResponse("Commission not found", 200);
        }

        // 🔹 Update only if introduceAmountPaid is changing from false → true
        if (introduceAmountPaid && !commission.introduceAmountPaid) {
            commission.introduceAmountPaid = true;
            commission.paidAmount += commission.introduceAmount; // Add introduceAmount to paidAmount
            commission.dueAmount -= commission.introduceAmount;  // Subtract introduceAmount from dueAmount

            // Ensure dueAmount doesn't go below 0
            if (commission.dueAmount < 0) commission.dueAmount = 0;

            await commission.save();
        } else if (!introduceAmountPaid && commission.introduceAmountPaid) {
            // Optional: handle reverting payment if needed
            commission.introduceAmountPaid = false;
            commission.paidAmount -= commission.introduceAmount;
            commission.dueAmount += commission.introduceAmount;

            if (commission.paidAmount < 0) commission.paidAmount = 0;

            await commission.save();
        }

        return sendSuccessResponse("Commission updated successfully", { commission });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
