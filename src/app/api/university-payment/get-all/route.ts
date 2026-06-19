import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import StaffModel from "@/models/office/staff.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import UniversityPaymentModel from "@/models/university/universityPayment.model";
import InvoiceModel from "@/models/invoice/invoice.model";
import PaymentTypeModel from "@/models/common/paymentType.model";
import { authenticate } from "@/lib/authenticate";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const {
            page = 1,
            limit = 10,
            search = '',
        }: {
            page?: number;
            limit?: number;
            search?: string;
        } = body;

        const skip = (page - 1) * limit;
        let filter: any = {};

        if (search && search.trim() !== "") {
            const searchRegex = new RegExp(search, "i");
            const numericSearch = !isNaN(Number(search)) ? Number(search) : undefined;

            const [
                matchingInvoice,
                matchingStaff,
                matchingPaymentType,
            ] = await Promise.all([
                StaffModel.find({
                    $or: [
                        { fullName: searchRegex },
                        { firstName: searchRegex },
                        { lastName: searchRegex },
                        { email: searchRegex },
                        { mobileNumber: searchRegex },
                        { nic: searchRegex },
                        { address: searchRegex },
                    ],
                }, { id: 1 }),

                InvoiceModel.find(
                    {
                        $or: [
                            { invoiceDate: searchRegex },
                            { totalPrice: numericSearch },
                        ],
                    },
                    { id: 1 }
                ),

                PaymentTypeModel.find({
                    $or: [
                        { "title.SN": searchRegex },
                        { "title.EN": searchRegex },
                        { "title.TM": searchRegex },
                    ],
                }, { id: 1 })
            ]);

            const invoiceIdsFromSearch = matchingInvoice.map((i) => i.id);
            const staffIds = matchingStaff.map((s) => s.id);
            const paymentTypeIds = matchingPaymentType.map((pt) => pt.id);

            const searchFilter = {
                $or: [
                    { smallDescription: searchRegex },
                    { date: searchRegex },
                    { invoiceId: numericSearch },
                    { invoiceId: { $in: invoiceIdsFromSearch } },
                    { createdBy: { $in: staffIds } },
                    { paymentType: { $in: paymentTypeIds } },
                ],
            };

            if (filter.invoiceId) {
                filter = { $and: [filter, searchFilter] };
            } else {
                filter = searchFilter;
            }
        }

        const universityPayments = await UniversityPaymentModel.find(filter)
            .skip(skip)
            .limit(limit)
            .select("-_id -__v -createDate -updatedDate")
            .populate({ path: "invoiceInfo", select: "id name -_id" })
            .populate({ path: "staffInfo", select: "id fullName -_id" })
            .populate({ path: "paymentTypeInfo", select: "id title -_id" })
            .sort({ createDate: -1 })
            .exec();

        const totalUniversityPayments = await UniversityPaymentModel.countDocuments();

        if (!universityPayments || universityPayments.length === 0) {
            return sendSuccessResponse("No university payments found", {
                page,
                limit,
                totalPages: 0,
                totalUniversityPayments: 0,
                universityPayments: []
            });
        }

        return sendSuccessResponse("University payments retrieved successfully!", {
            page,
            limit,
            totalPages: Math.ceil(totalUniversityPayments / limit),
            totalUniversityPayments,
            universityPayments,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
