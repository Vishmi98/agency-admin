import { NextRequest } from "next/server";

import { ImageKitService } from "@/lib/imagekit";
import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import WebEventsModel from "@/models/web/webEvents.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const eventId = formData.get("id") as string;
        const imagesFiles = formData.getAll("images") as File[];

        // ✅ Validate ID
        if (!eventId) {
            return sendErrorResponse("Event ID is required", 200);
        }

        // ✅ Validate images
        if (!imagesFiles || imagesFiles.length === 0) {
            return sendErrorResponse("No images provided", 200);
        }

        // ✅ Find existing event
        const existingEvent = await WebEventsModel.findOne({
            id: Number(eventId),
        });

        if (!existingEvent) {
            return sendErrorResponse("Event not found", 200);
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

        existingEvent.images.push(...newImages);
        existingEvent.imageIds.push(...newImageIds);

        // updatedDate handled by pre-save hook
        await existingEvent.save();

        return sendSuccessResponse("Images added successfully", { event: existingEvent });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}