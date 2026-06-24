import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import StaffModel from "@/models/office/staff.model";
import { generateAdminToken } from "@/utils/jwt";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";
import { createActivityLog } from "@/utils/createActivityLog";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        const decryptedBody = decryptData(
            body.payload
        );

        const { email, password } = decryptedBody;

        if (!email || !password) {
            return sendErrorResponse("Email and password are required", 200);
        }

        const user = await StaffModel.findOne({ email });

        if (!user) {
            return sendErrorResponse("User not found", 200);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid || user.roll <= 0) {
            return sendErrorResponse("Invalid credentials", 200);
        }

        const token = generateAdminToken({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            roll: user.roll,
            email: user.email,
        });

        const encryptedResponse = encryptData({
            token,
        });

        await createActivityLog({
            userId: user.id,
            action: "STAFF_LOGIN_SUCCESS",
            endpoint: "/api/auth/login-staff",
            method: "POST",
            meta: {
                email: user.email,
                roll: user.roll,
                time: new Date().toISOString()
            }
        });

        return sendSuccessResponse(
            "SUCCESS Admin login!",
            encryptedResponse
        );
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
