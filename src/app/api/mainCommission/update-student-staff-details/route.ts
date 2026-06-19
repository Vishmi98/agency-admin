import { NextRequest } from "next/server";

import { authenticate } from "@/lib/authenticate";
import { connectDB } from "@/lib/mongodb";
import MainCommissionModel from "@/models/office/mainCommission.model";
import StaffModel from "@/models/office/staff.model";
import { StudentModel } from "@/models/student/student.model";

import {
    sendErrorResponse,
    sendSuccessResponse,
} from "@/services/apiResponse";

export async function POST(req: NextRequest) {
    const authResult = await authenticate(req);

    if (authResult instanceof Response) {
        return authResult;
    }

    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));

        const {
            page = 1,
            batchSize = 50,
        } = body;

        const skip = (page - 1) * batchSize;

        const commissions = await MainCommissionModel.find({
            $or: [
                { studentDetails: { $exists: false } },
                { staffDetails: { $exists: false } },
            ],
        })
            .skip(skip)
            .limit(batchSize)
            .lean();

        if (!commissions.length) {
            return sendSuccessResponse("Migration completed", {
                updatedCount: 0,
                hasMore: false,
            });
        }

        const studentIds = Array.from(
            new Set(
                commissions
                    .map((c) => c.studentId)
                    .filter(Boolean)
            )
        );

        const staffIds = Array.from(
            new Set(
                commissions
                    .map((c) => c.staffId)
                    .filter(Boolean)
            )
        );

        const students = await StudentModel.find(
            { id: { $in: studentIds } },
            { _id: 0, __v: 0 }
        ).lean();

        const staffs = await StaffModel.find(
            { id: { $in: staffIds } },
            { _id: 0, __v: 0 }
        ).lean();

        const studentMap = new Map(
            students.map((student) => [student.id, student])
        );

        const staffMap = new Map(
            staffs.map((staff) => [staff.id, staff])
        );

        const bulkOperations = commissions.map((commission) => ({
            updateOne: {
                filter: {
                    _id: commission._id,
                },
                update: {
                    $set: {
                        studentDetails:
                            studentMap.get(commission.studentId) || null,

                        staffDetails:
                            staffMap.get(commission.staffId) || null,

                        updatedDate: new Date(),
                    },
                },
            },
        }));

        const result = await MainCommissionModel.bulkWrite(
            bulkOperations
        );

        return sendSuccessResponse(
            "Batch updated successfully",
            {
                page,
                batchSize,
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
                hasMore: commissions.length === batchSize,
            }
        );
    } catch (error) {
        console.error(error);

        return sendErrorResponse(
            "Server error",
            200
        );
    }
}