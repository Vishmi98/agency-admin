import { NextRequest } from "next/server";

import { ImageKitService } from "@/lib/imagekit";
import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import WebAwardModel from "@/models/web/webAward.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const year = formData.get("year") as string;
        const title = formData.get("title") as string;
        const imagesFiles = formData.getAll("images") as File[];

        if (!year) {
            return sendErrorResponse("Missing required field: year", 200);
        }

        if (!title) {
            return sendErrorResponse("Missing required field: title", 200);
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
            imagesFiles.map(file => uploadToImageKit(file, "web_awards/images"))
        );

        let id = 100;
        const lastData = await WebAwardModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
        if (lastData) {
            id = lastData.id + 1;
        }

        const newAward = await WebAwardModel.create({
            id,
            year,
            title,
            images: imageUploadResponses.map(img => img.url),
            imageIds: imageUploadResponses.map(img => img.fileId),
        });

        return sendSuccessResponse("Award created successfully", { award: newAward });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
