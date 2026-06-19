import { CreateMainCommissionResponseDataType, CreateMainCommissionResponseType, CreateSubCommissionResponseDataType, CreateSubCommissionResponseType, MainCommissionResponseDataType, MainCommissionResponseType, MainCommissionType, SubCommissionResponseDataType, SubCommissionResponseType, SubCommissionType, UpdateIntroduceAmountPaidResponseDataType, UpdateStaffResponseDataType } from "../commission.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const addMainCommission = async (body: MainCommissionType): Promise<CreateMainCommissionResponseDataType> => {
    const response: CreateMainCommissionResponseType = await apiCall({
        url: `${URL}/mainCommission/create`,
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

export const getMainCommissions = async (page: number, limit?: number, search?: string): Promise<MainCommissionResponseDataType> => {
    const response: MainCommissionResponseType = await apiCall({
        url: `${URL}/mainCommission/get-all`,
        method: 'POST',
        body: { page, limit, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        commissions: data.commissions || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalCommissions: data.totalCommissions ?? 0,
    };
};

export const updateStatus = async (commissionId: number): Promise<UpdateIntroduceAmountPaidResponseDataType> => {
    const response: UpdateIntroduceAmountPaidResponseDataType = await apiCall({
        url: `${URL}/mainCommission/update-status`,
        method: 'POST',
        body: { commissionId },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const updateStatusToPaid = async (commissionId: number): Promise<UpdateIntroduceAmountPaidResponseDataType> => {
    const response: UpdateIntroduceAmountPaidResponseDataType = await apiCall({
        url: `${URL}/mainCommission/update-status-paid`,
        method: 'POST',
        body: { commissionId },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const addSubCommission = async (body: SubCommissionType): Promise<CreateSubCommissionResponseDataType> => {
    const response: CreateSubCommissionResponseType = await apiCall({
        url: `${URL}/subCommission/create`,
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

export const getSubCommissions = async (page: number, limit?: number, search?: string): Promise<SubCommissionResponseDataType> => {
    const response: SubCommissionResponseType = await apiCall({
        url: `${URL}/subCommission/get-all`,
        method: 'POST',
        body: { page, limit, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        commissions: data.commissions || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalCommissions: data.totalCommissions ?? 0,
    };
};

export const getMainCommissionsWithoutFullSubCommissions = async (page: number, limit?: number): Promise<MainCommissionResponseDataType> => {
    const response: MainCommissionResponseType = await apiCall({
        url: `${URL}/mainCommission/without-full-subCommissions`,
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
        totalCommissions: data.totalCommissions ?? 0,
    };
};

export const changeStaff = async (commissionId: number, month: string, staffId: number): Promise<UpdateStaffResponseDataType> => {
    const response: UpdateStaffResponseDataType = await apiCall({
        url: `${URL}/subCommission/update-staff`,
        method: 'POST',
        body: { commissionId, month, staffId },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const updateAvailableToPaid = async (commissionId: number, month: string,): Promise<UpdateStaffResponseDataType> => {
    const response: UpdateStaffResponseDataType = await apiCall({
        url: `${URL}/subCommission/update-status-paid`,
        method: 'POST',
        body: { commissionId, month },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};