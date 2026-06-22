import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import "@/models/common/gender.model";
import TitleModel from "@/models/common/title.model";
import StaffModel from "@/models/office/staff.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { authenticate } from "@/lib/authenticate";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

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

        if (search && search.trim() !== "") {
            const searchRegex = new RegExp(search, "i");
            const numericSearch = !isNaN(Number(search)) ? Number(search) : undefined;

            const matchingTitle = await TitleModel.find(
                {
                    $or: [
                        { "title.SN": searchRegex },
                        { "title.EN": searchRegex },
                        { "title.TM": searchRegex },
                    ],
                },
                { id: 1 }
            );

            const titleIds = matchingTitle.map((t) => Number(t.id));

            queryFilters.$or = [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { fullName: searchRegex },
                { email: searchRegex },
                { roll: numericSearch },
                { id: numericSearch },
                { nic: searchRegex },
                { address: searchRegex },
                { title: { $in: titleIds } },
            ];
        }

        const staffs = await StaffModel.find(queryFilters)
            .skip(skip)
            .limit(limit)
            .select("-_id -__v -facebookId -googleId -authProvider")
            .populate("titleInfo", "title -_id")
            .populate("genderInfo", "title -_id")
            .sort({ createDate: -1 })
            .exec();

        const totalStaffs = await StaffModel.countDocuments(queryFilters);

        const encryptedResponse = encryptData({
            staffs,
            page,
            limit,
            totalPages: Math.ceil(
                totalStaffs / limit
            ),
            totalStaffs
        });

        return sendSuccessResponse("OK", encryptedResponse);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}