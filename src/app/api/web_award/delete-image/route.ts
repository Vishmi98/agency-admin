import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import WebAwardModel from "@/models/web/webAward.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/lib/imagekit";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { id, imageId } = body;

        // ✅ Validation
        if (!id || !imageId) {
            return sendErrorResponse("ID and imageId are required", 200);
        }

        // ✅ Find award
        const award = await WebAwardModel.findOne({ id: Number(id) });

        if (!award) {
            return sendErrorResponse("Award not found", 200);
        }

        // ✅ Find index of image
        const index = award.imageIds.findIndex((imgId: string) => imgId === imageId);

        if (index === -1) {
            return sendErrorResponse("Image not found", 200);
        }

        // ✅ Remove from arrays
        const removedImage = award.images[index];

        award.images.splice(index, 1);
        award.imageIds.splice(index, 1);

        // ✅ Delete from ImageKit (IMPORTANT)
        try {
            await ImageKitService.deleteImage(imageId);
        } catch (err) {
            console.warn("ImageKit delete failed:", err);
        }

        await award.save();

        return sendSuccessResponse("Image deleted successfully", {
            award,
            removedImage,
        });

    } catch (error) {
        console.error(error);
        return sendErrorResponse("Server error", 200);
    }
}