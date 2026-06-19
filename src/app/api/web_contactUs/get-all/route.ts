import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/web/webCountry.model";
import "@/models/web/webUniversity.model";
import "@/models/web/webCourse.model";
import "@/models/common/branch.model";
import "@/models/university/qualification.model";
import "@/models/common/leadStatus.model";

import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ContactUsModel from "@/models/web/contactUs.model";
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

        const leads = await ContactUsModel.find()
            .skip(skip)
            .limit(limit)
            .select("-_id -__v -createDate -updatedDate")
            .populate("countryInfo", "-_id")
            .populate("uniInfo", "-_id")
            .populate("courseInfo", "-_id")
            .populate("branchInfo", "-_id")
            .populate("studyInfo", "-_id")
            .populate("statusInfo", "-_id")
            .sort({ createDate: -1 })
            .exec();

        if (!leads || leads.length === 0) {
            return sendSuccessResponse("No leads found", { leads: [] });
        }

        const totalLeads = await ContactUsModel.countDocuments();

        return sendSuccessResponse("Leads retrieved successfully", {
            page,
            limit,
            totalPages: Math.ceil(totalLeads / limit),
            totalLeads,
            leads,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}