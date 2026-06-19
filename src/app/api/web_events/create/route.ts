import { NextRequest } from "next/server";

import { ImageKitService } from "@/lib/imagekit";
import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import WebEventsModel from "@/models/web/webEvents.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const eventName = formData.get("eventName") as string;
        const imagesFiles = formData.getAll("images") as File[];

        if (!eventName) {
            return sendErrorResponse("Missing required field: eventName", 200);
        }

        if (!imagesFiles || imagesFiles.length === 0) {
            return sendErrorResponse("At least one image is required", 200);
        }

        const uploadToImageKit = async (file: File, folder: string) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}-${file.name}`;
            return await ImageKitService.uploadImage(buffer, filename, folder);
        };

        const imageUploadResponses = await Promise.all(
            imagesFiles.map(file => uploadToImageKit(file, "web_events/images"))
        );

        let id = 100;
        const lastData = await WebEventsModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
        if (lastData) {
            id = lastData.id + 1;
        }

        const newEvent = await WebEventsModel.create({
            id,
            eventName,
            images: imageUploadResponses.map(img => img.url),
            imageIds: imageUploadResponses.map(img => img.fileId),
        });

        return sendSuccessResponse("Event created successfully", { event: newEvent });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
