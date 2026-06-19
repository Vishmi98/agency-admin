import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import MonthlyPayModel from "@/models/common/MonthlyPay.model";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // 1. Get the current date details
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // 0 = Jan, 4 = May, etc.

        // 2. Fetch the payment record for the current month and year
        // Note: If you also need to filter by company, add it here (e.g., companyName: authResult.companyName)
        const payment = await MonthlyPayModel.findOne({
            year: currentYear,
            month: currentMonth
        });

        // 3. Handle case where no payment record exists yet for this month
        if (!payment) {
            return sendSuccessResponse("No payment record found for this month", {
                showReminder: false,
                message: "No payment record found for the current month."
            });
        }

        // Debugging logs safely placed after fetching data
        console.log("TYPE:", typeof payment);
        console.log("PAYMENT:", payment);
        console.log("YEAR:", payment.year);
        console.log("MESSAGE:", payment.message);

        // 4. Check if the payment has NOT been paid
        if (!payment.isPaid) {
            return sendSuccessResponse("Reminder allowed", {
                showReminder: true,
                message: payment.message // Direct property access works fine in Mongoose documents
            });
        }

        // 5. If paid, return no reminder
        return sendSuccessResponse("No reminder needed", {
            showReminder: false,
        });

    } catch (error) {
        console.error("Monthly payment reminder error:", error);
        return sendErrorResponse("Server error", 200);
    }
}