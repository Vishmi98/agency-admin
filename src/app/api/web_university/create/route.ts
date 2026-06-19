import { NextRequest, NextResponse } from "next/server";

import { ImageKitService } from "@/lib/imagekit";
import { connectDB } from "@/lib/mongodb";
import WebUniversityModel from "@/models/web/webUniversity.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const name = formData.get("name") as string;
        const code = formData.get("code") as string;
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;
        const address = formData.get("address") as string;
        const city = formData.get("city") as string;
        const countryId = formData.get("countryId") as string;
        const internationalStudentCount = formData.get("internationalStudentCount") as string;
        const livingCost = formData.get("livingCost") as string;
        const currency = formData.get("currency") as string;
        const localRanking = formData.get("localRanking") as string;
        const worldRanking = formData.get("worldRanking") as string;
        const overview = formData.get("overview") as string;
        const universityWebsite = formData.get("universityWebsite") as string;
        const url = formData.get("url") as string;

        const coverImageFile = formData.get("coverImage") as File | null;
        const logoFile = formData.get("logo") as File | null;
        const imagesFiles = formData.getAll("images") as File[];

        if (!name || !code || !url) {
            return sendErrorResponse("Missing required fields", 200);
        }

        const existingUni = await WebUniversityModel.findOne({
            $or: [
                { name: name.trim() },
                { code: code.trim() },
                { url: url.trim() },
            ],
        });

        if (existingUni) {
            return sendErrorResponse("University with the same name, code, or url already exists.", 200);
        }

        const uploadToImageKit = async (file: File, folder: string) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}-${file.name}`;
            return await ImageKitService.uploadImage(buffer, filename, folder);
        };

        const coverImageRes = coverImageFile
            ? await uploadToImageKit(coverImageFile, "web_universities/cover")
            : null;

        const logoRes = logoFile
            ? await uploadToImageKit(logoFile, "web_universities/logo")
            : null;

        const imageUploadResponses = await Promise.all(
            imagesFiles.map(file => uploadToImageKit(file, "web_universities/images"))
        );

        let id = 100;
        const lastUni = await WebUniversityModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
        if (lastUni) {
            id = lastUni.id + 1;
        }

        const newUniversity = await WebUniversityModel.create({
            id,
            name,
            code,
            phone,
            email,
            address,
            city,
            countryId: countryId ? parseInt(countryId) : undefined,
            internationalStudentCount: internationalStudentCount ? parseInt(internationalStudentCount) : undefined,
            livingCost: livingCost ? parseFloat(livingCost) : undefined,
            currency,
            localRanking: localRanking ? parseInt(localRanking) : undefined,
            worldRanking: worldRanking ? parseInt(worldRanking) : undefined,
            overview,
            universityWebsite,
            url,
            coverImage: coverImageRes?.url || "",
            coverImageId: coverImageRes?.fileId || "",
            logo: logoRes?.url || "",
            logoId: logoRes?.fileId || "",
            images: imageUploadResponses.map(img => img.url),
            imageIds: imageUploadResponses.map(img => img.fileId),
        });

        return sendSuccessResponse("University created successfully", { university: newUniversity });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
