import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { authenticate } from "@/lib/authenticate";
import {
    sendErrorResponse,
    sendSuccessResponse,
} from "@/services/apiResponse";

import "@/models/common/leadStatus.model";
import "@/models/university/university.model";

import StaffModel from "@/models/office/staff.model";
import LeadModel from "@/models/office/lead.model";
import { StudentModel } from "@/models/student/student.model";
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
            page = 1,
            limit = 10,
            search = "",
        } = decryptedBody;

        const skip = (page - 1) * limit;

        const queryFilters: any = {};

        // =========================
        // SEARCH LOGIC
        // =========================
        if (search && search.trim() !== "") {
            const searchRegex = new RegExp(search, "i");
            const numericSearch = !isNaN(Number(search))
                ? Number(search)
                : undefined;

            const [matchingStudents, matchingStaff, matchingCourses] =
                await Promise.all([
                    StudentModel.find(
                        {
                            $or: [
                                { firstName: searchRegex },
                                { lastName: searchRegex },
                                { email: searchRegex },
                                { mobileNumber: searchRegex },
                                { nic: searchRegex },
                            ],
                        },
                        { id: 1 }
                    ),

                    StaffModel.find(
                        {
                            $or: [
                                { fullName: searchRegex },
                                { firstName: searchRegex },
                                { lastName: searchRegex },
                                { email: searchRegex },
                                { mobileNumber: searchRegex },
                                { nic: searchRegex },
                            ],
                        },
                        { id: 1 }
                    ),

                    CourseModel.find(
                        {
                            $or: [
                                { title: searchRegex },
                                { shortCode: searchRegex },
                                { level: searchRegex },
                                { description: searchRegex },
                            ],
                        },
                        { id: 1 }
                    ),
                ]);

            const studentIds = matchingStudents.map(
                (s) => s.id
            );

            const staffIds = matchingStaff.map((s) => s.id);

            const courseIds = matchingCourses.map(
                (c) => c.id
            );

            queryFilters.$or = [
                ...(studentIds.length
                    ? [{ studentId: { $in: studentIds } }]
                    : []),

                ...(staffIds.length
                    ? [{ staffId: { $in: staffIds } }]
                    : []),

                ...(courseIds.length
                    ? [{ courseId: { $in: courseIds } }]
                    : []),

                ...(numericSearch !== undefined
                    ? [
                        { id: numericSearch },
                        { status: numericSearch },
                        { courseId: numericSearch },
                    ]
                    : []),
            ];
        }

        // =========================
        // FETCH LEADS
        // =========================
        const leads = await LeadModel.find(queryFilters)
            .skip(skip)
            .limit(limit)
            .select("-__v")
            .populate("studentInfo", "-_id")
            .populate("staffInfo", "-_id")
            .populate({
                path: "courseInfo",
                select: "-_id",
                populate: {
                    path: "universityInfo",
                    select: "-_id",
                },
            })
            .populate("statusInfo", "-_id")
            .sort({ createDate: -1 });

        const totalLeads = await LeadModel.countDocuments(
            queryFilters
        );

        const encryptedResponse = encryptData({
            leads,
            page,
            limit,
            totalPages: Math.ceil(
                totalLeads / limit
            ),
            totalLeads
        });

        return sendSuccessResponse("OK", encryptedResponse);
    } catch (error) {
        console.error("Lead Fetch Error:", error);
        return sendErrorResponse(
            "Server error",
            500
        );
    }
}