import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
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

        const body = await req.json();

        const {
            courseName,
            qualification,
            duration,
            nextIntake,
            studyType,
            overview,
            uniId,
            rank,
            entryScore,
            price,
            url,
        } = body;

        // Basic validation - you can extend this or use a schema validator
        if (!courseName || !url) {
            return sendErrorResponse("Required fields missing: courseName or url", 200);
        }

        // Check if course with same URL already exists
        const existingCourse = await WebCourseModel.findOne({ url });

        if (existingCourse) {
            return sendErrorResponse(
                "Course already exists with the same URL",
                200
            );
        }

        // Generate new id
        let id = 100;
        const lastCourse = await WebCourseModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
        if (lastCourse?.id) id = lastCourse.id + 1;

        const newCourse = await WebCourseModel.create({
            id,
            courseName,
            qualification,
            duration,
            nextIntake,
            studyType,
            overview,
            uniId,
            rank,
            entryScore,
            price,
            url,
            createDate: new Date(),
            updatedDate: new Date(),
        });

        return sendSuccessResponse("Course created successfully!", { course: newCourse });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
