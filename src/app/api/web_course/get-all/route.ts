import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/web/webCountry.model";
import "@/models/university/qualification.model";
import "@/models/web/webUniversity.model";
import "@/models/common/studyType.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import WebCourseModel from "@/models/web/webCourse.model";
import { authenticate } from "@/lib/authenticate";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const courses = await WebCourseModel.find()
            .select("-_id -__v -createDate -updatedDate")
            .populate("studyTypeInfo", "-_id")
            .populate({
                path: "uniInfo",
                select: "-_id",
                populate: { path: "countryInfo", select: "-_id" },
            })
            .populate("qualificationInfo", "-_id")
            .exec();

        return sendSuccessResponse("Courses fetched successfully", { courses });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
