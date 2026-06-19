import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { StudentModel } from "@/models/student/student.model";
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
            title,
            firstName,
            lastName,
            fullName,
            passportNo,
            issueDate,
            expireDate,
            visaIssueDate,
            visaExpireDate,
            phone,
            email,
            address,
            nic,
            password,
            createdBy,
            status,
            visaStatus,
            branchId,
        } = body;

        if (
            !title || !firstName || !lastName || !fullName ||
            !passportNo || !email || !branchId
        ) {
            return sendErrorResponse("Missing required fields", 200);
        }

        const existingStudent = await StudentModel.findOne({
            $or: [{ passportNo }, { email }]
        });

        if (existingStudent) {
            return sendErrorResponse("Student already exists with this passport or email", 200);
        }

        let id = 100;
        const lastStudent = await StudentModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
        if (lastStudent) {
            id = lastStudent.id + 1;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = await StudentModel.create({
            id,
            title,
            firstName,
            lastName,
            fullName,
            passportNo,
            issueDate: issueDate,
            expireDate: expireDate,
            visaIssueDate: visaIssueDate,
            visaExpireDate: visaExpireDate,
            phone,
            email,
            address,
            nic,
            password: hashedPassword,
            createdBy,
            status,
            visaStatus,
            branchId,
            createDate: new Date(),
            updatedDate: new Date()
        });

        return sendSuccessResponse("Student created successfully", { student: newStudent });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
