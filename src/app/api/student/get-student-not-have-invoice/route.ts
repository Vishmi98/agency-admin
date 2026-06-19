import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import "@/models/common/title.model";
import "@/models/common/studentStatus.model";
import "@/models/common/visaStatus.model";
import "@/models/common/branch.model";
import { StudentModel } from "@/models/student/student.model";
import InvoiceModel from "@/models/invoice/invoice.model";
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
        }: {
            page?: number;
            limit?: number;
        } = body;

        const skip = (page - 1) * limit;

        const studentsWithInvoices = await InvoiceModel.distinct("studentId");

        const students = await StudentModel.find({
            id: { $nin: studentsWithInvoices },
        })
            .skip(skip)
            .limit(limit)
            .select("-_id -__v -facebookId -googleId -password -authProvider")
            .populate("titleInfo", "title -_id")
            .populate("statusInfo", "title -_id")
            .populate("visaStatusInfo", "title -_id")
            .populate("branchInfo", "title -_id")
            .sort({ createDate: -1 })
            .exec();

        const totalStudents = await StudentModel.countDocuments({
            id: { $nin: studentsWithInvoices },
        });

        if (!students || students.length === 0) {
            return sendSuccessResponse("No students found", { students: [] });
        }

        return sendSuccessResponse("Students retrieved successfully", {
            page,
            limit,
            totalPages: Math.ceil(totalStudents / limit),
            totalStudents,
            students,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}