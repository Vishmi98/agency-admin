import { CreateLeadResponseDataType, CreateLeadResponseType, LeadsResponseDataType, LeadsResponseType, LeadStatusesResponseDataType, LeadStatusesResponseType, LeadType, UpdateLeadResponseDataType, UpdateLeadResponseType } from "./leads.types";

import { URL } from "@/constants/config";
import { decryptData } from "@/lib/decrypt";
import { encryptData } from "@/lib/encrypt";
import apiCall from "@/services/api.services";

export const getLeadsData = async (page: number, limit?: number, search?: string): Promise<LeadsResponseDataType> => {
    const encryptedPayload = encryptData({
        page,
        limit: limit || 5,
        search: search || ''
    });

    const response: LeadsResponseType = await apiCall({
        url: `${URL}/lead/get-all`,
        method: 'POST',
        body: {
            payload: encryptedPayload,
        },
    });

    const decryptedData = decryptData(response.data);

    return {
        success: response.success,
        message: response.message,
        leads: decryptedData.leads,
        page: decryptedData.page,
        limit: decryptedData.limit,
        totalPages: decryptedData.totalPages,
        totalLeads: decryptedData.totalLeads,
    };
};

export const createLead = async (body: LeadType): Promise<CreateLeadResponseDataType> => {
    const encryptedPayload = encryptData(body);

    const response: CreateLeadResponseType = await apiCall({
        url: `${URL}/lead/create`,
        method: 'POST',
        body: {
            payload: encryptedPayload,
        },
    });

    const decryptedData = decryptData(response.data || "");

    return {
        success: response.success,
        message: response.message,
        data: {
            lead: decryptedData.lead,
        },
    };
};

export const updateInvoiceStatus = async (leadId: number, status: number): Promise<UpdateLeadResponseDataType> => {
    const encryptedPayload = encryptData({
        leadId,
        status
    });

    const response: UpdateLeadResponseType = await apiCall({
        url: `${URL}/lead/update-status`,
        method: 'POST',
        body: {
            payload: encryptedPayload,
        },
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            lead: response.data,
        },
    };
};

export const getLeadStatuses = async (): Promise<LeadStatusesResponseDataType> => {
    const encryptedPayload = encryptData({});

    const response: LeadStatusesResponseType = await apiCall({
        url: `${URL}/lead-status/get-all`,
        method: 'POST',
        body: {
            payload: encryptedPayload,
        },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        leadStatuses: data.leadStatuses || [],
    };
};