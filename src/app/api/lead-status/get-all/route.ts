import { connectDB } from "@/lib/mongodb";
import LeadStatusModel from "@/models/common/leadStatus.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function GET() {
    try {
        await connectDB();

        const leadStatuses = await LeadStatusModel.find()
            .select("-_id -__v -createDate -updatedDate")

        return sendSuccessResponse("Lead statuses fetched successfully", { leadStatuses });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
