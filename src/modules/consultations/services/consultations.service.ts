import { UpdateConsultationResponseDataType, UpdateConsultationResponseType, WebConsultationsResponseDataType, WebConsultationsResponseType } from "../consultations.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getWebConsultationsData = async (page: number, limit?: number): Promise<WebConsultationsResponseDataType> => {
    const response: WebConsultationsResponseType = await apiCall({
        url: `${URL}/web_contactUs/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        leads: data.leads || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalLeads: data.totalLeads ?? 0,
    };
};

export const updateConsultationStatus = async (id: number, status: number): Promise<UpdateConsultationResponseDataType> => {
    const response: UpdateConsultationResponseType = await apiCall({
        url: `${URL}/web_contactUs/update-status`,
        method: 'POST',
        body: { id, status },
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            lead: response.data,
        },
    };
};