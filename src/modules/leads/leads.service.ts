import { CreateLeadResponseDataType, CreateLeadResponseType, LeadsResponseDataType, LeadsResponseType, LeadStatusesResponseDataType, LeadStatusesResponseType, LeadType, UpdateLeadResponseDataType, UpdateLeadResponseType } from "./leads.types";

import { URL } from "@/constants/config";
import apiCall from "@/services/api.services";

export const getLeadsData = async (page: number, limit?: number, search?: string): Promise<LeadsResponseDataType> => {
    const response: LeadsResponseType = await apiCall({
        url: `${URL}/lead/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
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

export const createLead = async (body: LeadType): Promise<CreateLeadResponseDataType> => {
    const response: CreateLeadResponseType = await apiCall({
        url: `${URL}/lead/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            lead: response.data,
        },
    };
};

export const updateInvoiceStatus = async (leadId: number, status: number): Promise<UpdateLeadResponseDataType> => {
    const response: UpdateLeadResponseType = await apiCall({
        url: `${URL}/lead/update-status`,
        method: 'POST',
        body: { leadId, status },
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
    const response: LeadStatusesResponseType = await apiCall({
        url: `${URL}/lead-status/get-all`,
        method: 'GET',
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        leadStatuses: data.leadStatuses || [],
    };
};