import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { authenticate } from "@/lib/authenticate";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import LeadModel from "@/models/office/lead.model";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";

export async function POST(req: NextRequest) {
    // Authenticate user
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult;

    try {
        await connectDB();

        const body = await req.json();

        const decryptedBody = decryptData(
            body.payload
        );

        const {
            studentId,
            staffId,
            courseId,
            status,
            note
        } = decryptedBody;

        // Validation
        if (!studentId || !staffId || !courseId) {
            return sendErrorResponse(
                "studentId, staffId and courseId are required",
                200
            );
        }

        // Generate Lead ID
        let id = 1;

        const lastLead = await LeadModel.findOne(
            {},
            { id: 1 }
        )
            .sort({ id: -1 })
            .limit(1);

        if (lastLead) {
            id = lastLead.id + 1;
        }

        // Create Lead
        const newLead = await LeadModel.create({
            id,
            studentId,
            staffId,
            courseId,
            status: status || 1,
            note,
            createDate: new Date(),
            updatedDate: new Date(),
        });

        const encryptedResponse = encryptData({
            lead: newLead,
        });

        return sendSuccessResponse(
            "Lead created successfully!",
            encryptedResponse
        );
    } catch (error) {
        console.error("Create Lead Error:", error);

        return sendErrorResponse(
            "Server error",
            200
        );
    }
}