import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import TitleModel from "@/models/common/title.model";
import StudentStatusModel from "@/models/common/studentStatus.model";
import VistaStatusModel from "@/models/common/visaStatus.model";
import BranchModel from "@/models/common/branch.model";
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

        const body = await req.json().catch(() => ({}));
        const {
            page = 1,
            limit = 10,
            search = '',
        }: {
            page?: number;
            limit?: number;
            search?: string;
        } = body;

        const skip = (page - 1) * limit;
        const queryFilters: any = {};
        const orConditions: any[] = [];

        if (search && search.trim() !== "") {
            const searchRegex = new RegExp(search, "i");
            const numericSearch = !isNaN(Number(search)) ? Number(search) : undefined;

            const [
                matchingTitle,
                matchingStatus,
                matchingVisaStatus,
                matchingBranch,
            ] = await Promise.all([
                TitleModel.find(
                    {
                        $or: [
                            { "title.SN": searchRegex },
                            { "title.EN": searchRegex },
                            { "title.TM": searchRegex },
                        ],
                    },
                    { id: 1 }
                ),
                StudentStatusModel.find(
                    {
                        $or: [
                            { "title.SN": searchRegex },
                            { "title.EN": searchRegex },
                            { "title.TM": searchRegex },
                        ],
                    },
                    { id: 1 }
                ),
                VistaStatusModel.find(
                    {
                        $or: [
                            { "title.SN": searchRegex },
                            { "title.EN": searchRegex },
                            { "title.TM": searchRegex },
                        ],
                    },
                    { id: 1 }
                ),
                BranchModel.find(
                    {
                        $or: [
                            { "title.SN": searchRegex },
                            { "title.EN": searchRegex },
                            { "title.TM": searchRegex },
                        ],
                    },
                    { id: 1 }
                ),
            ]);

            const titleIds = matchingTitle.map((m) => m.id);
            const statusIds = matchingStatus.map((m) => m.id);
            const visaStatusIds = matchingVisaStatus.map((m) => m.id);
            const branchIds = matchingBranch.map((m) => m.id);

            orConditions.push(
                { fullName: searchRegex },
                { firstName: searchRegex },
                { lastName: searchRegex },
                { passportNo: searchRegex },
                { phone: searchRegex },
                { email: searchRegex },
                { address: searchRegex },
                { nic: searchRegex },
                { issueDate: searchRegex },
                { expireDate: searchRegex },
                { visaIssueDate: searchRegex },
                { visaExpireDate: searchRegex }
            );

            if (numericSearch !== undefined) {
                orConditions.push(
                    { id: numericSearch },
                    { branchId: numericSearch },
                    { status: numericSearch },
                    { visaStatus: numericSearch },
                    { createdBy: numericSearch }
                );
            }

            if (titleIds.length) orConditions.push({ title: { $in: titleIds } });
            if (statusIds.length) orConditions.push({ status: { $in: statusIds } });
            if (visaStatusIds.length)
                orConditions.push({ visaStatus: { $in: visaStatusIds } });
            if (branchIds.length)
                orConditions.push({ branchId: { $in: branchIds } });

            queryFilters.$or = orConditions;
        }

        const students = await StudentModel.find(queryFilters)
            .skip(skip)
            .limit(limit)
            .sort({ createDate: -1 })
            .select("-_id -__v -password")
            .populate("titleInfo", "id title -_id")
            .populate("statusInfo", "id title -_id")
            .populate("visaStatusInfo", "id title -_id")
            .populate("branchInfo", "id title -_id")
            .exec();

        const totalStudents = await StudentModel.countDocuments(queryFilters);

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