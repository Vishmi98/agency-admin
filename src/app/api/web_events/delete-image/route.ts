import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/lib/imagekit";
import WebEventsModel from "@/models/web/webEvents.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { id, imageId } = body;

        // ✅ Validation
        if (!id || !imageId) {
            return sendErrorResponse("ID and imageId are required", 200);
        }

        // ✅ Find event
        const event = await WebEventsModel.findOne({ id: Number(id) });

        if (!event) {
            return sendErrorResponse("Event not found", 200);
        }

        // ✅ Find index of image
        const index = event.imageIds.findIndex((imgId: string) => imgId === imageId);

        if (index === -1) {
            return sendErrorResponse("Image not found", 200);
        }

        // ✅ Remove from arrays
        const removedImage = event.images[index];

        event.images.splice(index, 1);
        event.imageIds.splice(index, 1);

        // ✅ Delete from ImageKit (IMPORTANT)
        try {
            await ImageKitService.deleteImage(imageId);
        } catch (err) {
            console.warn("ImageKit delete failed:", err);
        }

        await event.save();

        return sendSuccessResponse("Image deleted successfully", {
            event,
            removedImage,
        });

    } catch (error) {
        console.error(error);
        return sendErrorResponse("Server error", 200);
    }
}