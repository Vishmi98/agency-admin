import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/lib/imagekit";
import UniversityPaymentModel from "@/models/university/universityPayment.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const invoiceId = formData.get("invoiceId");
        const paymentType = formData.get("paymentType");
        const createdBy = formData.get("createdBy");
        const date = formData.get("date")?.toString();
        const documentFile = formData.get("image") as File | null;

        if (!date?.trim() || !invoiceId || !paymentType || !createdBy) {
            return sendErrorResponse("All required fields must be provided.", 200);
        }

        const invoiceIdNum = Number(invoiceId);
        const paymentTypeNum = Number(paymentType);
        const createdByNum = Number(createdBy);

        if (isNaN(invoiceIdNum) || isNaN(paymentTypeNum) || isNaN(createdByNum)) {
            return sendErrorResponse("Numeric fields must be valid numbers.", 200);
        }

        let documentPath = "";
        let documentId = "";

        if (documentFile) {
            const buffer = Buffer.from(await documentFile.arrayBuffer());
            const filename = `${Date.now()}-${documentFile.name}`;
            const uploaded = await ImageKitService.uploadImage(buffer, filename, "universityPayments");

            documentPath = uploaded.url;
            documentId = uploaded.fileId;
        }

        let id = 100;
        const lastRecord = await UniversityPaymentModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
        if (lastRecord?.id) {
            id = lastRecord.id + 1;
        }

        const universityPayment = await UniversityPaymentModel.create({
            id,
            invoiceId: invoiceIdNum,
            paymentType: paymentTypeNum,
            documentPath,
            documentId,
            createdBy: createdByNum,
            date,
            createDate: new Date(),
            updatedDate: new Date(),
        });

        return sendSuccessResponse("University payment created successfully", { universityPayment });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
