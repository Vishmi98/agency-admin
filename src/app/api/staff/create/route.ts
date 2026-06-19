import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { registerStaffService } from "@/services/staff.service";
import { Language } from "../../../../../enums/common.enum";
import StaffModel from "@/models/office/staff.model";
import { ERROR_MESSAGES } from "@/constants/messages";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const body = await req.json();
        const {
            firstName,
            lastName,
            password,
            email,
            roll,
            title,
            nic,
            gender,
            fullName,
            address,
            branchId,
        } = body;

        const langHeader = req.headers.get("lb-lang");
        const selectedLanguage: Language =
            (Number(langHeader) as Language) || Language.EN;

        const existingUser = await StaffModel.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: ERROR_MESSAGES.EMAIL_EXISTS[selectedLanguage],
                },
                { status: 400 }
            );
        }

        await registerStaffService({
            firstName,
            lastName,
            password,
            email,
            roll: Number(roll),
            title: Number(title),
            nic,
            gender: Number(gender),
            fullName,
            address,
            branchId,
        });

        return sendSuccessResponse("Staff created successfully!");
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
