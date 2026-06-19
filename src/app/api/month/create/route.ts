import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import MonthModel from "@/models/office/month.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";


// Correct function declaration
function generateDateId(date: string): string {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
}

export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { dates, workingDays, month } = body;

        if (!Array.isArray(dates)) {
            return sendErrorResponse("'dates' must be an array of date strings (YYYY-MM-DD).", 200);
        }

        if (typeof workingDays !== "number" || workingDays < 0) {
            return sendErrorResponse("'workingDays' must be a non-negative number.", 200);
        }

        if (!month || typeof month !== "string") {
            return sendErrorResponse("'month' is required and must be a string (YYYY-MM).", 200);
        }

        const existing = await MonthModel.findOne({ month });
        if (existing) {
            return sendErrorResponse(`Month ${month} already exists.`, 200);
        }

        const [yearStr, monthStr] = month.split("-");
        const year = parseInt(yearStr, 10);
        const monthIndex = parseInt(monthStr, 10);

        const daysInMonth = new Date(year, monthIndex, 0).getDate();

        const monthData = {
            month: month,
            dates: [] as {
                id: string;
                date: string;
                isHoliday: boolean;
            }[],
            workDays: workingDays,
        };

        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${month}-${String(day).padStart(2, "0")}`;
            monthData.dates.push({
                id: generateDateId(date),
                date,
                isHoliday: dates.includes(date),
            });
        }

        const newMonth = new MonthModel(monthData);
        await newMonth.save();

        return sendSuccessResponse("Month created successfully!", newMonth);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
