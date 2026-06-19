import { BranchesResponseDataType, BranchesResponseType, CreateStaffResponseDataType, CreateStaffResponseType, GendersResponseDataType, GendersResponseType, StaffResponseDataType, StaffResponseType, StaffType, StaffWithoutSalaryResponseDataType, StaffWithoutSalaryResponseType, TitlesResponseDataType, TitlesResponseType, UpdateAttendanceMatterStatusResponseDataType, UpdateStaffResponseDataType, UpdateStaffResponseType, } from "../staff.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const createStaff = async (body: StaffType): Promise<CreateStaffResponseDataType> => {

    const response: CreateStaffResponseType = await apiCall({
        url: `${URL}/staff/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            staff: response.data,
        },
    };
};

export const getStaffData = async (page: number, limit?: number, search?: string): Promise<StaffResponseDataType> => {
    const response: StaffResponseType = await apiCall({
        url: `${URL}/staff/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        staffs: data.staffs || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalStaffs: data.totalStaffs ?? 0,
    };
};

export const getTitles = async (): Promise<TitlesResponseDataType> => {
    const response: TitlesResponseType = await apiCall({
        url: `${URL}/title/get-all`,
        method: 'POST',
    })

    return ({
        success: response.success,
        message: response.message,
        titles: response.data.titles || [],
    });
};

export const getGenders = async (): Promise<GendersResponseDataType> => {
    const response: GendersResponseType = await apiCall({
        url: `${URL}/gender/get-all`,
        method: 'POST',
    })

    return ({
        success: response.success,
        message: response.message,
        genders: response.data.genders || [],
    });
};

export const getBranches = async (): Promise<BranchesResponseDataType> => {
    const response: BranchesResponseType = await apiCall({
        url: `${URL}/branch/get-all`,
        method: 'POST',
    })

    return ({
        success: response.success,
        message: response.message,
        branches: response.data.branches || [],
    });
};

export const updateAttendanceMatterStatus = async (staffId: number, isAttendanceMatter: boolean): Promise<UpdateAttendanceMatterStatusResponseDataType> => {
    const response: UpdateAttendanceMatterStatusResponseDataType = await apiCall({
        url: `${URL}/staff/update-attendance-matter`,
        method: 'POST',
        body: { staffId, isAttendanceMatter },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const updateBasicSalaryPayStatus = async (staffId: number, isBasicSalaryPay: boolean): Promise<UpdateAttendanceMatterStatusResponseDataType> => {
    const response: UpdateAttendanceMatterStatusResponseDataType = await apiCall({
        url: `${URL}/staff/update-basic-salary-pay`,
        method: 'POST',
        body: { staffId, isBasicSalaryPay },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const getBasicSalaryPayingStaffData = async (page: number, limit?: number): Promise<StaffResponseDataType> => {
    const response: StaffResponseType = await apiCall({
        url: `${URL}/staff/get-basic-salary-paying-staffs`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        staffs: data.staffs || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalStaffs: data.totalStaffs ?? 0,
    }
}

export const getStaffWithoutSalary = async (page: number, limit?: number, month?: string): Promise<StaffWithoutSalaryResponseDataType> => {
    const response: StaffWithoutSalaryResponseType = await apiCall({
        url: `${URL}/salary/staff-without`,
        method: 'POST',
        body: { month, page, limit: limit || 5, },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || "No message provided",
        month: data.month || 0,
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalStaffs: data.totalStaffs ?? 0,
        staff: data.staff || [],
    };
};

export const activeStaffMember = async (staffId: number, isActive: boolean): Promise<UpdateAttendanceMatterStatusResponseDataType> => {
    const response: UpdateAttendanceMatterStatusResponseDataType = await apiCall({
        url: `${URL}/staff/staff-active`,
        method: 'POST',
        body: { staffId, isActive },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const getIsAttendanceMatterStaffs = async (page: number, limit?: number, search?: string): Promise<StaffResponseDataType> => {
    const response: StaffResponseType = await apiCall({
        url: `${URL}/staff/isAttendanceMatter-staff`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        staffs: data.staffs || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalStaffs: data.totalStaffs ?? 0,
    };
};

export const updateStaff = async (id: string | number, body: StaffType): Promise<UpdateStaffResponseDataType> => {
    const response: UpdateStaffResponseType = await apiCall({
        url: `${URL}/staff/update`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            staff: response.data,
        },
    };
};

export const addStaffPassword = async (id: number, newPassword: string): Promise<CreateStaffResponseDataType> => {

    const response: CreateStaffResponseType = await apiCall({
        url: `${URL}/staff/update-password`,
        method: 'POST',
        body: {id, newPassword},
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            staff: response.data,
        },
    };
};