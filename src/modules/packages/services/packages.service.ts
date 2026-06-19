import { CreatePackageResponseDataType, CreatePackageResponseType, LanguagesResponseDataType, LanguagesResponseType, PackageResponseDataType, PackageResponseType, PackageType, StudyTypesResponseDataType, StudyTypesResponseType } from "../package.types";

import { URL } from "@/constants/config";
import apiCall from "@/services/api.services";


export const getPackagesData = async (page: number, limit?: number, search?: string): Promise<PackageResponseDataType> => {
    const response: PackageResponseType = await apiCall({
        url: `${URL}/package/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        packages: data.packages || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalPackages: data.totalPackages ?? 0,
    };
};

export const createPackage = async (body: PackageType): Promise<CreatePackageResponseDataType> => {

    const response: CreatePackageResponseType = await apiCall({
        url: `${URL}/package/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            package: response.data,
        },
    };
};

export const getStudyTypeData = async (): Promise<StudyTypesResponseDataType> => {
    const response: StudyTypesResponseType = await apiCall({
        url: `${URL}/study-type/get-all`,
        method: 'POST',
    });

    return {
        success: response.success,
        message: response.message,
        studyTypes: response.data.studyTypes || [],
    };
};

export const getLanguageData = async (): Promise<LanguagesResponseDataType> => {
    const response: LanguagesResponseType = await apiCall({
        url: `${URL}/language/get-all`,
        method: 'POST',
    });

    return {
        success: response.success,
        message: response.message,
        languages: response.data.languages || [],
    };
};

export const updatePackage = async (id: number, costInLkr: number | string, priceInLkr: number | string,): Promise<CreatePackageResponseDataType> => {

    const response: CreatePackageResponseType = await apiCall({
        url: `${URL}/package/update`,
        method: 'POST',
        body: { id, costInLkr, priceInLkr },
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            package: response.data,
        },
    };
};