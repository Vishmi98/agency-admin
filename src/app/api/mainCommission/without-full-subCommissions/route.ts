import { NextRequest } from "next/server";

import "@/models/university/university.model";
import "@/models/invoice/invoice.model";
import "@/models/university/package.model";
import "@/models/invoice/extraPayment.model";
import "@/models/invoice/discount.model";
import "@/models/student/student.model";
import "@/models/office/staff.model";
import "@/models/common/branch.model";
import "@/models/invoice/invoiceStatus.model";
import "@/models/payment/payment.model";
import { authenticate } from "@/lib/authenticate";
import { connectDB } from "@/lib/mongodb";
import MainCommissionModel from "@/models/office/mainCommission.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import SubCommissionModel from "@/models/office/subCommission.model";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { page = 1, limit = 10 } = body;
        const skip = (page - 1) * limit;

        // Step 1: Get all main commission IDs that have 12 or more sub-commissions
        const aggregated = await SubCommissionModel.aggregate([
            { $group: { _id: "$commissionId", count: { $sum: 1 } } },
            { $match: { count: { $gte: 12 } } },
            { $project: { _id: 1 } },
        ]);

        const fullCommissionIds = aggregated.map((a) => a._id);

        // Step 2: Find main commissions that are NOT in fullCommissionIds
        const commissions = await MainCommissionModel.find({
            id: { $nin: fullCommissionIds },
        })
            .skip(skip)
            .limit(limit)
            .select("-__v")

        const totalCommissions = await MainCommissionModel.countDocuments({
            id: { $nin: fullCommissionIds },
        });

        return sendSuccessResponse("Main commissions without full sub-commissions retrieved", {
            page,
            limit,
            totalPages: Math.ceil(totalCommissions / limit),
            totalCommissions,
            commissions,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
