import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { authenticate } from "@/lib/authenticate";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import LeadModel from "@/models/office/lead.model";
import { decryptData } from "@/lib/decrypt";


export async function POST(req: NextRequest) {
    // Authenticate user
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult;

    try {
        await connectDB();

        const body = await req.json();

        const decryptedBody = decryptData(body.payload || "");

        const {
            leadId,
            status,
        }: {
            leadId: number;
            status: number;
        } = decryptedBody;

        // Validation
        if (!leadId || !status) {
            return sendErrorResponse(
                "leadId and status are required",
                200
            );
        }

        // Find lead
        const lead = await LeadModel.findOne({ id: leadId });

        if (!lead) {
            return sendErrorResponse(
                "Lead not found",
                200
            );
        }

        // Update status
        lead.status = status;
        lead.updatedDate = new Date();

        await lead.save();

        return sendSuccessResponse(
            "Lead status updated successfully",
            { lead }
        );
    } catch (error) {
        console.error("Update Lead Status Error:", error);

        return sendErrorResponse(
            "Server error",
            200
        );
    }
}