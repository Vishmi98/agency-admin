import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { StudentModel } from "@/models/student/student.model";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";


export async function POST(req: NextRequest) {

    try {
        await connectDB();

        const body = await req.json();

        const decryptedBody = decryptData(
            body.payload
        );

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
        } = decryptedBody;

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
            password: 'password',
            createdBy,
            status,
            visaStatus,
            branchId,
            createDate: new Date(),
            updatedDate: new Date()
        });

        // 🔥 ENCRYPT RESPONSE (important)
        const encryptedResponse = encryptData({
            student: newStudent
        });

        return sendSuccessResponse("Student created successfully", encryptedResponse);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
