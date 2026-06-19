import { NextRequest } from "next/server";

import "@/models/university/university.model";
import "@/models/invoice/invoice.model";
import "@/models/university/package.model";
import "@/models/invoice/extraPayment.model";
import "@/models/invoice/discount.model";
import "@/models/common/branch.model";
import "@/models/invoice/invoiceStatus.model";
import "@/models/payment/payment.model";
import { authenticate } from "@/lib/authenticate";
import { connectDB } from "@/lib/mongodb";
import MainCommissionModel from "@/models/office/mainCommission.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import StaffModel from "@/models/office/staff.model";
import { StudentModel } from "@/models/student/student.model";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { page = 1, limit = 10, search = "" } = body;

        const skip = (page - 1) * limit;

        // 🔹 Build search filter
        let filter: any = {};
        if (search && search.trim() !== "") {
            const regex = new RegExp(search, "i");

            // Staff IDs
            const staffIds = await StaffModel.find(
                {
                    $or: [
                        { fullName: regex },
                        { email: regex },
                        { nic: regex },
                        { address: regex },
                    ],
                },
                { id: 1 }
            ).lean();

            // Student IDs
            const studentIds = await StudentModel.find(
                {
                    $or: [
                        { fullName: regex },
                        { email: regex },
                        { nic: regex },
                        { passportNo: regex },
                    ],
                },
                { id: 1 }
            ).lean();

            filter = {
                $or: [
                    // 🔹 Direct Commission fields
                    { id: !isNaN(Number(search)) ? Number(search) : undefined },
                    { invoiceId: !isNaN(Number(search)) ? Number(search) : undefined },
                    { studentId: !isNaN(Number(search)) ? Number(search) : undefined },
                    { packageId: !isNaN(Number(search)) ? Number(search) : undefined },
                    { uniId: !isNaN(Number(search)) ? Number(search) : undefined },
                    { branchId: !isNaN(Number(search)) ? Number(search) : undefined },
                    { staffId: !isNaN(Number(search)) ? Number(search) : undefined },

                    { date: regex },
                    { status: regex },

                    { amount: !isNaN(Number(search)) ? Number(search) : undefined },
                    { percentage: !isNaN(Number(search)) ? Number(search) : undefined },
                    { dueAmount: !isNaN(Number(search)) ? Number(search) : undefined },
                    { paidAmount: !isNaN(Number(search)) ? Number(search) : undefined },
                    { introduceAmount: !isNaN(Number(search)) ? Number(search) : undefined },
                    { monthlyAmount: !isNaN(Number(search)) ? Number(search) : undefined },

                    // 🔹 Staff & Students
                    { staffId: { $in: staffIds.map((s) => s.id) } },
                    { studentId: { $in: studentIds.map((s) => s.id) } },
                ].filter(Boolean), // remove undefined
            };
        }

        const commissions = await MainCommissionModel.find(filter)
            .skip(skip)
            .limit(limit)
            .select("-__v")
            .sort({ createDate: -1 })

        const totalCommissions = await MainCommissionModel.countDocuments(filter);

        return sendSuccessResponse("Commissions retrieved successfully", {
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
