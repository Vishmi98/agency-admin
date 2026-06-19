import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import StaffModel from "@/models/office/staff.model";
import ExpenseTypeModel from "@/models/common/expenseType.model";
import ExpenseModel from "@/models/office/expense.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";
import BranchModel from "@/models/common/branch.model";


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
                matchingStaff,
                matchingExpenseTypes,
                matchingBranch,
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

                ExpenseTypeModel.find({
                    $or: [
                        { "title.SN": searchRegex },
                        { "title.EN": searchRegex },
                        { "title.TM": searchRegex },
                    ],
                }, { id: 1 }),

                BranchModel.find({
                    $or: [
                        { "title.SN": searchRegex },
                        { "title.EN": searchRegex },
                        { "title.TM": searchRegex },
                    ],
                }, { id: 1 })
            ]);

            const staffIds = matchingStaff.map(s => s.id);
            const expenseTypeIds = matchingExpenseTypes.map(et => et.id);
            const branchIds = matchingBranch.map(et => et.id);

            filter = {
                $or: [
                    { smallDescription: searchRegex },
                    { date: searchRegex },
                    ...(numericSearch !== undefined ? [
                        { amount: numericSearch },
                    ] : []),
                    ...(staffIds.length > 0 ? [{ createdBy: { $in: staffIds } }] : []),
                    ...(expenseTypeIds.length > 0 ? [{ expenseType: { $in: expenseTypeIds } }] : []),
                    ...(branchIds.length > 0 ? [{ branchId: { $in: branchIds } }] : []),
                ],
            };
        }

        const expenses = await ExpenseModel.find(filter)
            .skip(skip)
            .limit(limit)
            .select("-_id -__v -createDate -updatedDate")
            .populate({ path: "staffInfo", select: "id fullName -_id" })
            .populate({ path: "expenseTypeInfo", select: "id title -_id" })
            .populate({ path: "branchInfo", select: "-_id" })
            .sort({ createDate: -1 })
            .exec();

        const totalExpenses = await ExpenseModel.countDocuments(filter);

        if (!expenses || expenses.length === 0) {
            return sendSuccessResponse("No expenses found", {
                page,
                limit,
                totalPages: 0,
                totalExpenses: 0,
                expenses: []
            });
        }

        return sendSuccessResponse("Expenses retrieved successfully!", {
            page,
            limit,
            totalPages: Math.ceil(totalExpenses / limit),
            totalExpenses,
            expenses,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
