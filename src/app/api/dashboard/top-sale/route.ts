import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import InvoiceModel from "@/models/invoice/invoice.model";
import { sendSuccessResponse, sendErrorResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const staffInvoiceCounts = await InvoiceModel.aggregate([
            {
                $match: {
                    invoiceDate: {
                        $gte: firstDayOfMonth.toISOString(),
                        $lte: lastDayOfMonth.toISOString()
                    }
                }
            },
            {
                $group: {
                    _id: "$staffId",
                    invoiceCount: { $sum: 1 },
                    lastInvoiceDate: { $max: "$invoiceDate" }
                }
            },
            {
                $lookup: {
                    from: "staffs",
                    localField: "_id",
                    foreignField: "id",
                    as: "staffInfo"
                }
            },
            {
                $unwind: "$staffInfo"
            },
            {
                "$sort": { invoiceCount: -1, }
            },
            {
                "$limit": 5
            },
            {
                $project: {
                    staffId: "$_id",
                    firstName: "$staffInfo.firstName",
                    lastName: "$staffInfo.lastName",
                    invoiceCount: 1,
                    invoiceDate: "$lastInvoiceDate"
                }
            }
        ]);

        return sendSuccessResponse("Invoice retrieved successfully", { topStaffsCurrentMonth: staffInvoiceCounts });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
