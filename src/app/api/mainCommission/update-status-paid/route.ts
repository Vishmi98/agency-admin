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
import InvoiceModel from "@/models/invoice/invoice.model";
import { markMainCommissionsByInvoicePaid } from "@/utils/common.util";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult;

    try {
        await connectDB();

        const body = await req.json();
        const { commissionId } = body;

        // Find the commission
        const commission = await MainCommissionModel.findOne({ id: commissionId });
        if (!commission) {
            return sendErrorResponse("Commission not found", 200);
        }

        // Only update if status is currently "available"
        if (commission.status !== "available") {
            return sendErrorResponse("Commission is not in available status", 200);
        }

        // 🔹 Use the common service to mark commission & related invoice as paid
        const result = await markMainCommissionsByInvoicePaid(commission.invoiceId);

        return sendSuccessResponse("Commission status updated to paid", result);
    } catch (error: any) {
        console.error(error);
        return sendErrorResponse("Server error", 200);
    }
}
