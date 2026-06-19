import { NextRequest } from "next/server";

import "@/models/office/staff.model";
import "@/models/common/expenseType.model";
import "@/models/invoice/invoice.model";
import "@/models/university/package.model";
import "@/models/student/student.model";
import "@/models/common/paymentType.model";
import "@/models/common/branch.model";
import "@/models/office/month.model";
import "@/models/office/attendance.model";
import "@/models/office/salaryAdvance.model";
import "@/models/university/university.model";

import { connectDB } from "@/lib/mongodb";
import ExpenseModel from "@/models/office/expense.model";
import PaymentModel from "@/models/payment/payment.model";
import AccountModel from "@/models/office/account.model";
import SalaryModel from "@/models/office/salary.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { month = "" } = body;

        if (!month) return sendErrorResponse("Month is required", 200);

        const regex = new RegExp(`^${month}`); // matches YYYY-MM

        // 1️⃣ Fetch expenses, payments & salary for the month
        const [expenses, payments, salaries] = await Promise.all([
            ExpenseModel.find({ date: { $regex: regex } })
                .populate("staffInfo", "id fullName -_id")
                .populate("expenseTypeInfo", "id title.EN -_id"),

            PaymentModel.find({ paymentDate: { $regex: regex } })
                .populate({
                    path: "invoiceInfo",
                    select: "id packageId -_id",
                    populate: {
                        path: "packageInfo",
                        select: "id title uniId -_id",
                        populate: {
                            path: "uniInfo",
                            select: "id name -_id",
                        },
                    },
                })
                .populate("studentInfo", "id fullName passportNo -_id")
                .populate("staffInfo", "id fullName -_id")
                .populate("paymentTypeInfo", "id title.EN -_id")
                .populate("branchInfo", "id title.EN -_id"),

            SalaryModel.find({ month })
                .populate("staffInfo", "id fullName -_id")
                .populate("monthInfo", "month title -_id")
                .populate("attendanceInfo", "date status -_id")
                .populate("salaryAdvanceInfo", "id amount date -_id")
                .populate("branchInfo", "id title.EN -_id")
        ]);


        // 2️⃣ Fetch existing Account records for this month to avoid duplicates
        const existingAccounts = await AccountModel.find({ date: { $regex: regex } }).select(
            "type sourceId amount description studentId branchId date"
        );
        const existingMap = new Map(
            existingAccounts.map(a => [
                `${a.type}-${a.sourceId}`,
                {
                    amount: a.amount,
                    description: a.description,
                    studentId: a.studentId,
                    branchId: a.branchId,
                    date: a.date
                }
            ])
        );

        // 3️⃣ Prepare new Account entries
        let currentIdDoc = await AccountModel.findOne().sort({ id: -1 });
        let newId = currentIdDoc ? currentIdDoc.id + 1 : 1;

        const accountEntries = [];

        for (const exp of expenses) {
            if (!existingMap.has(`expense-${exp.id}`)) {
                const expenseTypeName = exp.expenseTypeInfo?.title?.EN || "";
                accountEntries.push({
                    id: newId++,
                    type: "expense",
                    sourceId: exp.id,
                    amount: exp.amount,
                    description: `${expenseTypeName} - ${exp.smallDescription}`,
                    branchId: exp.branchId,
                    date: exp.date,
                });
            }
        }

        for (const pay of payments) {
            if (!existingMap.has(`income-${pay.id}`)) {
                const studentName = pay.studentInfo?.fullName || "";
                const packageTitle = pay.invoiceInfo?.packageInfo?.title || "";
                const paymentType = pay.paymentTypeInfo?.title?.EN || "";
                const uniName = pay.invoiceInfo?.packageInfo?.uniInfo?.name || ""
                accountEntries.push({
                    id: newId++,
                    type: "income",
                    sourceId: pay.id,
                    amount: pay.amountLkr,
                    description: `${studentName} - ${uniName} - ${packageTitle} - ${paymentType}`,
                    studentId: pay.studentId,
                    branchId: pay.branchId,
                    date: pay.paymentDate,
                });
            }
        }

        for (const sal of salaries) {
            if (!existingMap.has(`salary-${sal.id}`)) {
                const staffName = sal.staffInfo?.fullName || "";
                const branchName = sal.staffInfo?.branchInfo?.title?.EN || "Colombo";
                accountEntries.push({
                    id: newId++,
                    type: "salary",
                    sourceId: sal.id,
                    amount: sal.netSalary,
                    description: `${staffName} - ${branchName}`,
                    date: sal.month, // salary uses month as "date"
                });
            }
        }

        // 4️⃣ Insert new Account entries
        if (accountEntries.length > 0) {
            await AccountModel.insertMany(accountEntries);
        }

        const accounts = await AccountModel.find({ date: { $regex: regex } })
            .populate({
                path: "expenseInfo",
                populate: [
                    { path: "staffInfo", select: "id fullName -_id" },
                    { path: "expenseTypeInfo", select: "id title.EN -_id" },
                ],
            })
            .populate({
                path: "paymentInfo",
                populate: [
                    {
                        path: "invoiceInfo",
                        select: "id packageId -_id",
                        populate: {
                            path: "packageInfo",
                            select: "id title uniId -_id",
                            populate: {
                                path: "uniInfo",
                                select: "id name -_id",
                            },
                        },
                    },
                    { path: "studentInfo", select: "id fullName passportNo -_id" },
                    { path: "staffInfo", select: "id fullName -_id" },
                    { path: "paymentTypeInfo", select: "id title.EN -_id" },
                    { path: "branchInfo", select: "id title.EN -_id" },
                ],
            })
            .populate({
                path: "salaryInfo",
                populate: [
                    { path: "staffInfo", select: "id fullName -_id" },
                    { path: "monthInfo", select: "month title -_id" },
                    { path: "attendanceInfo", select: "date status -_id" },
                    { path: "salaryAdvanceInfo", select: "id amount date -_id" },
                ],
            })
            .sort({ date: 1 })

        // 5️⃣ Calculate totals
        let totalIncome = 0;
        let totalExpenses = 0;

        accounts.forEach(acc => {
            if (acc.type === "income") {
                totalIncome += acc.amount || 0;
            } else if (acc.type === "expense" || acc.type === "salary") {
                totalExpenses += acc.amount || 0;
            }
        });

        const profit = totalIncome - totalExpenses;

        return sendSuccessResponse("Accounts for month retrieved successfully", {
            accounts,
            totalIncome,
            totalExpenses,
            profit
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
