import axios from "axios";

import { CreateUniversityResponseDataType, CreateUniversityResponseType, CreateWebUniversityResponseDataType, CreateWebUniversityResponseType, FilterUniversityReportType, PublishWebUniversityResponseDataType, UniversitiesByCountryIdResponseDataType, UniversitiesByCountryIdResponseType, UniversityPaymentsResponseDataType, UniversityPaymentsResponseType, UniversityResponseDataType, UniversityResponseType, UniversityType, WebUniversityResponseDataType, WebUniversityResponseType } from "../university.types";

import { URL } from "@/constants/config";
import apiCall from "@/services/api.services";


export const getUniversityData = async (page: number, limit?: number): Promise<UniversityResponseDataType> => {
    const response: UniversityResponseType = await apiCall({
        url: `${URL}/university/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        universities: data.universities || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalUniversities: data.totalUniversities ?? 0,
    };
};

export const createUniversity = async (body: UniversityType): Promise<CreateUniversityResponseDataType> => {
    const response: CreateUniversityResponseType = await apiCall({
        url: `${URL}/university/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            university: response.data,
        },
    };
};

export const createUniversityPayment = async (data: FormData) => {
    const res = await axios.post(`${URL}/university-payment/create`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    const response = res.data; // <-- Important

    return {
        success: response.success,
        message: response.message,
        data: {
            universityPayment: response.data.universityPayment,
        },
    };
};

export const getUniversityPaymentsData = async (page: number, limit?: number, search?: string): Promise<UniversityPaymentsResponseDataType> => {
    const response: UniversityPaymentsResponseType = await apiCall({
        url: `${URL}/university-payment/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    return {
        success: response.success,
        message: response.message,
        universityPayments: response.data.universityPayments,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        totalUniversityPayments: response.data.totalUniversityPayments,
    };
};

export const getFilterUniversityReports = async (
    page: number,
    limit?: number,
    filters?: FilterUniversityReportType
): Promise<UniversityResponseDataType> => {
    const response: UniversityResponseType = await apiCall({
        url: `${URL}/university/filter`,
        method: 'POST',
        body: {
            page,
            limit: limit || 5,
            ...filters,
        },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        universities: data.universities || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalUniversities: data.totalUniversities ?? 0,
    };
};

export const getWebUniversities = async (page: number, limit?: number): Promise<WebUniversityResponseDataType> => {
    const response: WebUniversityResponseType = await apiCall({
        url: `${URL}/web_university/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        universities: data.universities || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalUniversities: data.totalUniversities ?? 0,
    };
};

export const createWebUniversity = async (formData: FormData): Promise<CreateWebUniversityResponseDataType> => {
    const response: CreateWebUniversityResponseType = await axios.post(
        `${URL}/web_university/create`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return {
        success: response.success,
        message: response.message,
        data: {
            university: response.data,
        },
    };
};

export const publishWebUniversity = async (id: number, isPublish: boolean): Promise<PublishWebUniversityResponseDataType> => {
    const response: PublishWebUniversityResponseDataType = await apiCall({
        url: `${URL}/web_university/publish`,
        method: 'POST',
        body: { id, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};