import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { authenticate } from "@/lib/authenticate";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import UniversityModel from "@/models/university/university.model";
import CourseModel from "@/models/university/course.model";
import "@/models/common/country.model";

export async function POST(req: NextRequest) {
    // AUTH
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult;

    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));

        const {
            page = 1,
            limit = 10,
            search = "",
        }: {
            page?: number;
            limit?: number;
            search?: string;
        } = body;

        const skip = (page - 1) * limit;

        const queryFilters: any = {};

        // ===============================
        // 🔥 ADVANCED SEARCH LOGIC
        // ===============================
        if (search && search.trim() !== "") {
            const searchRegex = new RegExp(search, "i");

            const numericSearch = !isNaN(Number(search))
                ? Number(search)
                : undefined;

            // -------------------------------
            // 1. UNIVERSITY MATCHING
            // -------------------------------
            const matchingUniversities = await UniversityModel.find(
                {
                    $or: [
                        { name: searchRegex },
                        { address: searchRegex },
                        { email: searchRegex },
                        { phoneNumber: searchRegex },
                        ...(numericSearch !== undefined
                            ? [{ id: numericSearch }]
                            : []),
                    ],
                },
                { id: 1 }
            );

            const universityIds = matchingUniversities.map(
                (u) => u.id
            );

            // -------------------------------
            // 3. COURSE FILTER
            // -------------------------------
            queryFilters.$or = [
                // Basic fields
                { title: searchRegex },
                { shortCode: searchRegex },
                { description: searchRegex },
                { level: searchRegex },
                { structure: searchRegex },
                { slug: searchRegex },

                // Array fields
                { specializations: searchRegex },
                { intakes: searchRegex },
                { entryRequirements: searchRegex },
                { careerOpportunities: searchRegex },
                { features: searchRegex },

                // Nested object search
                { "englishRequirement.test": searchRegex },

                // Relationship mapping
                ...(universityIds.length > 0
                    ? [
                        {
                            universityId: {
                                $in: universityIds,
                            },
                        },
                    ]
                    : []),

                // Numeric search
                ...(numericSearch !== undefined
                    ? [
                        { id: numericSearch },
                        { universityId: numericSearch },
                        { credits: numericSearch },
                        { tuitionFee: numericSearch },
                        { applicationFee: numericSearch },
                    ]
                    : []),
            ];
        }

        // ===============================
        // FETCH COURSES
        // ===============================
        const courses = await CourseModel.find(queryFilters)
            .skip(skip)
            .limit(limit)
            .select("-__v")
            .populate("universityInfo", "-_id")
            .populate({
                path: "universityInfo",
                select: "-_id",
                populate: { path: "countryInfo", select: "-_id" },
            })
            .sort({ createDate: -1 });

        const totalCourses = await CourseModel.countDocuments(
            queryFilters
        );

        return sendSuccessResponse(
            "Courses retrieved successfully",
            {
                page,
                limit,
                totalPages: Math.ceil(
                    totalCourses / limit
                ),
                totalCourses,
                courses,
            }
        );
    } catch (error) {
        console.error("Get Courses Error:", error);
        return sendErrorResponse("Server error", 200);
    }
}