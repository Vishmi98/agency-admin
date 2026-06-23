import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { authenticate } from "@/lib/authenticate";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import CourseModel from "@/models/university/course.model";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";

export async function POST(req: NextRequest) {
    // AUTH
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult;

    try {
        await connectDB();

        const body = await req.json();

        const decryptedBody = decryptData(body.payload || "");

        const {
            id, // REQUIRED for update

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
        } = decryptedBody;

        // =========================
        // VALIDATION
        // =========================
        if (!id) {
            return sendErrorResponse("Course ID is required", 200);
        }

        const existingCourse = await CourseModel.findOne({ id });

        if (!existingCourse) {
            return sendErrorResponse("Course not found", 200);
        }

        // =========================
        // BUILD UPDATE PAYLOAD
        // =========================
        const updatePayload: any = {
            updatedDate: new Date(),
        };

        if (title !== undefined) updatePayload.title = title;
        if (shortCode !== undefined) updatePayload.shortCode = shortCode;
        if (description !== undefined) updatePayload.description = description;

        if (universityId !== undefined) updatePayload.universityId = universityId;

        if (level !== undefined) updatePayload.level = level;
        if (credits !== undefined) updatePayload.credits = credits;
        if (duration !== undefined) updatePayload.duration = duration;
        if (structure !== undefined) updatePayload.structure = structure;

        if (specializations !== undefined)
            updatePayload.specializations = specializations;

        if (intakes !== undefined)
            updatePayload.intakes = intakes;

        if (entryRequirements !== undefined)
            updatePayload.entryRequirements = entryRequirements;

        if (englishRequirement !== undefined)
            updatePayload.englishRequirement = englishRequirement;

        if (careerOpportunities !== undefined)
            updatePayload.careerOpportunities = careerOpportunities;

        if (features !== undefined)
            updatePayload.features = features;

        if (tuitionFee !== undefined)
            updatePayload.tuitionFee = tuitionFee;

        if (applicationFee !== undefined)
            updatePayload.applicationFee = applicationFee;

        if (isActive !== undefined)
            updatePayload.isActive = isActive;

        // =========================
        // UPDATE COURSE
        // =========================
        const updatedCourse = await CourseModel.findOneAndUpdate(
            { id },
            { $set: updatePayload },
            { new: true }
        )
            .select("-__v")
            .populate("universityInfo", "-_id")
            .populate({
                path: "universityInfo",
                select: "-_id",
                populate: { path: "countryInfo", select: "-_id" },
            });

        const encryptedResponse = encryptData({
            course: updatedCourse,
        });

        return sendSuccessResponse(
            "Course updated successfully!",
            encryptedResponse
        );
    } catch (error) {
        console.error("Update Course Error:", error);
        return sendErrorResponse("Server error", 200);
    }
}