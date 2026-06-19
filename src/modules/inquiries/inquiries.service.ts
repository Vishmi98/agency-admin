import { InquiriesResponseDataType, InquiriesResponseType } from "./inquiries.types";

import { URL } from "@/constants/config";
import apiCall from "@/services/api.services";


export const getInquiriesData = async (page: number, limit?: number, search?: string): Promise<InquiriesResponseDataType> => {
    const response: InquiriesResponseType = await apiCall({
        url: `${URL}/inquiry/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        inquiries: data.inquiries || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalInquiries: data.totalInquiries ?? 0,
    };
};