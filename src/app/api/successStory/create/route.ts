import { NextRequest } from "next/server";

import { ImageKitService } from "@/lib/imagekit";
import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import SuccessStory from "@/models/web/successStory.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const documentPathFile = formData.get("documentPath") as File | null;

        const uploadToImageKit = async (file: File, folder: string) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}-${file.name}`;
            return await ImageKitService.uploadImage(buffer, filename, folder);
        };

        const documentPathRes = documentPathFile
            ? await uploadToImageKit(documentPathFile, "successStories/image")
            : null;

        // Auto-increment numeric id
        let id = 100;
        const lastRecord = await SuccessStory.findOne({}, { id: 1 }).sort({ id: -1 });
        if (lastRecord) id = lastRecord.id + 1;

        const newSuccessStory = await SuccessStory.create({
            id,
            documentPath: documentPathRes?.url || "",
            documentId: documentPathRes?.fileId || "",
        });

        return sendSuccessResponse("Success story created successfully", { successStory: newSuccessStory });
    } catch (error) {
        console.error("POST /successStory/create error:", error);
        return sendErrorResponse("Server error", 500);
    }
}
