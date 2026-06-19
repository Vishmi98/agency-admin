import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import MonthlyPayModel from "@/models/common/MonthlyPay.model";

export async function POST(req: NextRequest) {
   
    try {
        await connectDB();

        const body = await req.json();
        const { companyName, year, month, isPaid, sendMessage, paidAt, message } = body;

        // Validation: year and month are marked 'required: true' in your schema
        if (!year || !month) {
            return sendErrorResponse("Missing required fields: year and month are required.", 200);
            // Note: Swapped 200 to 200 because client-side input errors should ideally be 200 Bad Request
        }

        // Validate month bounds
        if (month < 1 || month > 12) {
            return sendErrorResponse("Invalid month. Must be between 1 and 12.", 200);
        }

        // Create the record
        const monthlyPayment = await MonthlyPayModel.create({
            companyName: companyName || "Real Smart", // Fallback to default if not provided
            year,
            month,
            isPaid: isPaid ?? false,
            sendMessage: sendMessage ?? false,
            paidAt: isPaid ? (paidAt || new Date()) : undefined, // Auto-set paidAt if marked as paid
            message
        });

        return sendSuccessResponse("Monthly payment created successfully", { monthlyPayment });
    } catch (error: any) {
        console.error("Error creating monthly payment:", error);
        return sendErrorResponse(error.message || "Server error", 500);
        // Changed 200 to 500 for internal server errors
    }
}