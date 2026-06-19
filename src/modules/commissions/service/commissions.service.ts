import { AddCommissionResponseDataType, AddCommissionResponseType, CommissionByRoleResponseType, CommissionResponseDataType, CommissionResponseType, CommissionType } from "../commissions.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const addCommission = async (body: CommissionType): Promise<AddCommissionResponseDataType> => {
    const response: AddCommissionResponseType = await apiCall({
        url: `${URL}/commission/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            commission: response.data,
        },
    };
};

export const getCommissionData = async (page: number, limit?: number): Promise<CommissionResponseDataType> => {
    const response: CommissionResponseType = await apiCall({
        url: `${URL}/commission/get-all`,
        method: 'POST',
        body: { page, limit },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        commissions: data.commissions || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalCommission: data.totalCommission ?? 0,
    };
};

export const getCommissionByRole = async (role: number): Promise<CommissionByRoleResponseType> => {
    const response: CommissionByRoleResponseType = await apiCall({
        url: `${URL}/commission/get-by-role`,
        method: 'POST',
        body: { role },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};