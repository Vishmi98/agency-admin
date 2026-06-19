import { AddBasicSalaryResponseDataType, AddBasicSalaryResponseType, AdditionalIncentiveType, BasicSalaryByStaffResponseType, BasicSalaryResponseDataType, BasicSalaryType, CreateSalaryAdvanceResponseDataType, CreateSalaryAdvanceResponseType, CreateSalaryResponseDataType, DeleteBasicSalaryResponseDataType, DeleteBasicSalaryResponseType, GetSalaryAdvancesByStaffIdResponseDataType, GetSalaryAdvancesByStaffIdResponseType, PreviewSalaryByStaffIdResponseDataType, PreviewSalaryByStaffIdResponseType, RoleNotHaveBasicSalaryResponseDataType, RoleNotHaveBasicSalaryResponseType, SalariesResponseDataType, SalariesResponseType, SalaryAdvanceResponseDataType, SalaryAdvanceResponseType, SalaryAdvanceType, UpdateBasicSalaryResponseDataType, UpdateBasicSalaryResponseType, } from "../salaryAdvance.types";

import { URL } from "@/constants/config";
import apiCall from "@/services/api.services";


export const addSalaryAdvance = async (body: SalaryAdvanceType): Promise<CreateSalaryAdvanceResponseDataType> => {
    const response: CreateSalaryAdvanceResponseType = await apiCall({
        url: `${URL}/salary/add-salary-advance`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            salaryAdvance: response.data,
        },
    };
};

export const getSalaryAdvanceData = async (page: number, limit?: number): Promise<SalaryAdvanceResponseDataType> => {
    const response: SalaryAdvanceResponseType = await apiCall({
        url: `${URL}/salary/get-salary-advances`,
        method: 'POST',
        body: { page, limit },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        salaryAdvances: data.salaryAdvances || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalSalaryAdvance: data.totalSalaryAdvance ?? 0,
    };
};

export const getSalaryAdvancesByMonth = async (page: number, limit?: number, month?: string): Promise<SalaryAdvanceResponseDataType> => {
    const response: SalaryAdvanceResponseType = await apiCall({
        url: `${URL}/salary/get-salary-advance-by-month`,
        method: 'POST',
        body: { page, limit, month },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        salaryAdvances: data.salaryAdvances || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalSalaryAdvance: data.totalSalaryAdvance ?? 0,
    };
};

export const getBasicSalaryData = async (): Promise<BasicSalaryResponseDataType> => {
    const response: BasicSalaryResponseDataType = await apiCall({
        url: `${URL}/role/get-all`,
        method: 'POST',
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        data: data || [],
    };
};

export const addBasicSalary = async (body: BasicSalaryType): Promise<AddBasicSalaryResponseDataType> => {
    const response: AddBasicSalaryResponseType = await apiCall({
        url: `${URL}/role/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const updateBasicSalary = async (body: BasicSalaryType): Promise<UpdateBasicSalaryResponseDataType> => {
    const response: UpdateBasicSalaryResponseType = await apiCall({
        url: `${URL}/role/update`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const deleteBasicSalary = async (role: number): Promise<DeleteBasicSalaryResponseDataType> => {
    const response: DeleteBasicSalaryResponseType = await apiCall({
        url: `${URL}/role/delete`,
        method: 'POST',
        body: { role },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const getSalariesByMonth = async (page: number, limit?: number, month?: string): Promise<SalariesResponseDataType> => {
    const response: SalariesResponseType = await apiCall({
        url: `${URL}/salary/get-by-month`,
        method: 'POST',
        body: { page, limit, ...(month && { month }) },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        salaries: data.salaries || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalSalaries: data.totalSalaries ?? 0,
    };
};

export const createSalary = async (staffId: number, month: string, additional: AdditionalIncentiveType[] = []): Promise<CreateSalaryResponseDataType> => {
    const response: CreateSalaryResponseDataType = await apiCall({
        url: `${URL}/salary/create`,
        method: 'POST',
        body: { staffId, month, additional },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const previewSalary = async (staffId: number, month: string): Promise<PreviewSalaryByStaffIdResponseDataType> => {
    const response: PreviewSalaryByStaffIdResponseType = await apiCall({
        url: `${URL}/salary/preview`,
        method: 'POST',
        body: { staffId, month },
    });

    return {
        success: response.success,
        message: response.message,
        salaryPreview: response.data.salaryPreview
    };
};

export const paySalary = async (staffId: number, month: string): Promise<CreateSalaryResponseDataType> => {
    const response: CreateSalaryResponseDataType = await apiCall({
        url: `${URL}/salary/salary-pay`,
        method: 'POST',
        body: { staffId, month },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const getSalaryAdvancesByStaffIdAndMonth = async (staffId: number, month: string): Promise<GetSalaryAdvancesByStaffIdResponseDataType> => {
    const response: GetSalaryAdvancesByStaffIdResponseType = await apiCall({
        url: `${URL}/salary/get-by-staff-month`,
        method: 'POST',
        body: { staffId, month },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        salaryAdvances: data.salaryAdvances || [],
    };
};