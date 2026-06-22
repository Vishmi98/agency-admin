import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { authenticate } from "@/lib/authenticate";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import CourseModel from "@/models/university/course.model";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";

export async function POST(req: NextRequest) {
    // Authenticate
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult;

    try {
        await connectDB();

        const body = await req.json();

        const decryptedBody = decryptData(
            body.payload
        );

        const {
            title,
            shortCode,
            description,
            universityId,
            level,
            credits,
            duration,
            structure,
            specializations = [],
            intakes = [],
            entryRequirements = [],
            englishRequirement = [],
            careerOpportunities = [],
            features = [],
            tuitionFee,
            applicationFee,
            isActive = true,
        } = decryptedBody;

        // Validation
        if (
            !title ||
            !universityId ||
            !level ||
            !credits ||
            !duration ||
            !Array.isArray(englishRequirement) ||
            englishRequirement.length === 0
        ) {
            return sendErrorResponse(
                "Missing required fields",
                200
            );
        }

        // Generate Course ID
        let id = 1;

        const lastCourse = await CourseModel.findOne({}, { id: 1 })
            .sort({ id: -1 })
            .limit(1);

        if (lastCourse) {
            id = lastCourse.id + 1;
        }

        const newCourse = await CourseModel.create({
            id,

            title,
            shortCode,
            description,

            universityId,

            level,
            credits,
            duration,
            structure,

            specializations,
            intakes,
            entryRequirements,
            englishRequirement,
            careerOpportunities,
            features,

            tuitionFee,
            applicationFee,

            isActive,

            createDate: new Date(),
            updatedDate: new Date(),
        });

        const encryptedResponse = encryptData({
            course: newCourse,
        });

        return sendSuccessResponse(
            "Course created successfully!",
            encryptedResponse
        );
    } catch (error) {
        console.error("Create Course Error:", error);
        return sendErrorResponse("Server error", 200);
    }
}