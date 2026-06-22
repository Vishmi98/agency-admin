import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import BranchModel from "@/models/common/branch.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));

        const decryptedBody = decryptData(body.payload || "");

        // (optional) if you ever pass filters later
        const { } = decryptedBody;

        const branches = await BranchModel.find()
            .select("-_id -__v -createDate -updatedDate")

        const encryptedResponse = encryptData({
            branches,
        });

        return sendSuccessResponse("OK", encryptedResponse);
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
