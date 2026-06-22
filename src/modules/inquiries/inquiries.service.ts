import { InquiriesResponseDataType, InquiriesResponseType } from "./inquiries.types";

import { URL } from "@/constants/config";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";
import apiCall from "@/services/api.services";


export const getInquiriesData = async (page: number, limit?: number, search?: string): Promise<InquiriesResponseDataType> => {
    const encryptedPayload = encryptData({
        page,
        limit: limit || 5,
        search: search || ''
    });

    const response: InquiriesResponseType = await apiCall({
        url: `${URL}/inquiry/get-all`,
        method: 'POST',
        body: {
            payload: encryptedPayload,
        },
    });

    const decryptedData = decryptData(response.data);

    return {
        success: response.success,
        message: response.message,
        inquiries: decryptedData.inquiries,
        page: decryptedData.page,
        limit: decryptedData.limit,
        totalPages: decryptedData.totalPages,
        totalInquiries: decryptedData.totalInquiries,
    };
};