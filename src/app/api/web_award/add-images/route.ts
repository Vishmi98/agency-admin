import { NextRequest } from "next/server";

import { ImageKitService } from "@/lib/imagekit";
import { connectDB } from "@/lib/mongodb";
import WebAwardModel from "@/models/web/webAward.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const awardId = formData.get("id") as string;
        const imagesFiles = formData.getAll("images") as File[];

        // ✅ Validate ID
        if (!awardId) {
            return sendErrorResponse("Award ID is required", 200);
        }

        // ✅ Validate images
        if (!imagesFiles || imagesFiles.length === 0) {
            return sendErrorResponse("No images provided", 200);
        }

        // ✅ Find existing award
        const existingAward = await WebAwardModel.findOne({
            id: Number(awardId),
        });

        if (!existingAward) {
            return sendErrorResponse("Award not found", 200);
        }

        // ✅ Upload images to ImageKit
        const uploadToImageKit = async (file: File, folder: string) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}-${file.name}`;
            return await ImageKitService.uploadImage(buffer, filename, folder);
        };

        const uploadResponses = await Promise.all(
            imagesFiles.map((file) =>
                uploadToImageKit(file, "web_awards/images")
            )
        );

        // ✅ Append new images
        const newImages = uploadResponses.map((img) => img.url);
        const newImageIds = uploadResponses.map((img) => img.fileId);

        existingAward.images.push(...newImages);
        existingAward.imageIds.push(...newImageIds);

        // updatedDate handled by pre-save hook
        await existingAward.save();

        return sendSuccessResponse("Images added successfully", { award: existingAward });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}