import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import StaffModel from "@/models/office/staff.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import UniversityModel from "@/models/university/university.model";
import CountryModel from "@/models/common/country.model";
import QualificationModel from "@/models/university/qualification.model";
import StudyTypeModel from "@/models/common/studyType.model";
import LanguageModel from "@/models/common/language.model";
import PackageModel from "@/models/university/package.model";
import { authenticate } from "@/lib/authenticate";


export async function POST(req: NextRequest) {
    // 🔹 Authenticate first
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult; // Stop if auth failed

    // authResult is AuthUser if valid
    const user = authResult

    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const {
            page = 1,
            limit = 10,
            search = '',
        }: {
            page?: number;
            limit?: number;
            search?: string;
        } = body;

        const skip = (page - 1) * limit;
        const queryFilters: any = {};

        if (search && search.trim() !== "") {
            const searchRegex = new RegExp(search, "i");
            const numericSearch = !isNaN(Number(search)) ? Number(search) : undefined;

            const [
                matchingUniversities,
                matchingStaff,
                matchingCountries,
                matchingQualifications,
                matchingStudyTypes,
                matchingLanguages
            ] = await Promise.all([
                UniversityModel.find({
                    $or: [
                        { name: searchRegex },
                        { address: searchRegex },
                        { phoneNumber: searchRegex },
                        { email: searchRegex },
                        { rank: numericSearch },
                        { code: numericSearch },
                    ],
                }, { id: 1 }),

                StaffModel.find({
                    $or: [
                        { fullName: searchRegex },
                        { firstName: searchRegex },
                        { lastName: searchRegex },
                        { email: searchRegex },
                        { mobileNumber: searchRegex },
                        { nic: searchRegex },
                        { address: searchRegex },
                    ],
                }, { id: 1 }),

                CountryModel.find({
                    $or: [
                        { "title.SN": searchRegex },
                        { "title.EN": searchRegex },
                        { "title.TM": searchRegex },
                    ],
                }, { id: 1 }),

                QualificationModel.find({
                    $or: [
                        { "title.SN": searchRegex },
                        { "title.EN": searchRegex },
                        { "title.TM": searchRegex },
                    ],
                }, { id: 1 }),

                StudyTypeModel.find({
                    $or: [
                        { "title.SN": searchRegex },
                        { "title.EN": searchRegex },
                        { "title.TM": searchRegex },
                    ],
                }, { id: 1 }),

                LanguageModel.find({
                    $or: [
                        { "title.SN": searchRegex },
                        { "title.EN": searchRegex },
                        { "title.TM": searchRegex },
                    ],
                }, { id: 1 }),
            ]);

            // Collect matched IDs
            const uniIds = matchingUniversities.map(u => u.id);
            const staffIds = matchingStaff.map(s => s.id);
            const countryIds = matchingCountries.map(c => c.id);
            const qualificationIds = matchingQualifications.map(q => q.id);
            const studyTypeIds = matchingStudyTypes.map(s => s.id);
            const languageIds = matchingLanguages.map(l => l.id);

            // Build $or filter for Package fields and foreign key matches
            queryFilters.$or = [
                { title: searchRegex },
                { courseName: searchRegex },
                { startDate: searchRegex },
                { nextIntake: searchRegex },
                ...(numericSearch !== undefined ? [
                    { cost: numericSearch },
                    { price: numericSearch },
                    { costInLkr: numericSearch },
                    { priceInLkr: numericSearch },
                    { duration: numericSearch },
                ] : []),
                ...(uniIds.length > 0 ? [{ uniId: { $in: uniIds } }] : []),
                ...(staffIds.length > 0 ? [{ createdBy: { $in: staffIds } }] : []),
                ...(countryIds.length > 0 ? [{ countryId: { $in: countryIds } }] : []),
                ...(qualificationIds.length > 0 ? [
                    { qualification: { $in: qualificationIds } },
                    { entryQualification: { $in: qualificationIds } },
                ] : []),
                ...(studyTypeIds.length > 0 ? [{ studyType: { $in: studyTypeIds } }] : []),
                ...(languageIds.length > 0 ? [{ language: { $in: languageIds } }] : []),
            ];
        }

        const packages = await PackageModel.find(queryFilters)
            .skip(skip)
            .limit(limit)
            .select("-__v")
            .populate("uniInfo", "-_id")
            .populate("languageInfo", "-_id")
            .populate("studyTypeInfo", "-_id")
            .populate("countryInfo", "-_id")
            .populate("qualificationInfo", "-_id")
            .populate("entryQualificationInfo", "-_id")
            .populate("staffInfo", "-_id")
            .sort({ createDate: -1 });

        const totalPackages = await PackageModel.countDocuments(queryFilters);

        return sendSuccessResponse("Packages retrieved successfully", {
            page,
            limit,
            totalPages: Math.ceil(totalPackages / limit),
            totalPackages,
            packages,
        });
    } catch (error) {
        return sendErrorResponse("Server error", 200);
    }
}
