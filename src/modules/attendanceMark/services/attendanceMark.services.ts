import { AbsentStaffsResponseDataType, AbsentStaffsResponseType, AddInTimeResponseDataType, AddInTimeResponseType, AddOutTimeResponseDataType, AddOutTimeResponseType, AttendanceMarkType, AttendanceResponseDataType, AttendanceResponseType, CreateLeaveResponseDataType, CreateLeaveResponseType, LeaveTypesResponseDataType, LeaveTypesResponseType, OutTimeType, StaffWithoutAttendanceResponseDataType, StaffWithoutAttendanceResponseType, TodayAttendanceResponseDataType, TodayAttendanceResponseType } from "../attendanceMarks.types";

import { URL } from "@/constants/config";
import { InTimeType } from "@/modules/test/test.types";
import apiCall from "@/services/api.services";


export const getTodayAttendance = async (page: number, limit?: number, date?: string): Promise<TodayAttendanceResponseDataType> => {
    const response: TodayAttendanceResponseType = await apiCall({
        url: `${URL}/attendance/get-all`,
        method: 'POST',
        body: { page, limit, ...(date && { date }) },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        attendance: data.attendance || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalAttendance: data.totalAttendance ?? 0,
    };
};

export const getAttendanceMarkData = async (page: number, limit?: number, date?: string): Promise<AttendanceResponseDataType> => {
    const response: AttendanceResponseType = await apiCall({
        url: `${URL}/attendance/get-all`,
        method: 'POST',
        body: { page, limit, ...(date && { date }) },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        attendance: data.attendance || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalAttendance: data.totalAttendance ?? 0,
    };
};

export const getAttendanceMissingOutTimeData = async (page: number, limit?: number): Promise<AttendanceResponseDataType> => {
    const response: AttendanceResponseType = await apiCall({
        url: `${URL}/attendance/miss-out`,
        method: 'POST',
        body: { page, limit },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        attendance: data.attendance || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalAttendance: data.totalAttendance ?? 0,
    };
};

export const getStaffWithoutAttendance = async (): Promise<StaffWithoutAttendanceResponseDataType> => {
    const response: StaffWithoutAttendanceResponseType = await apiCall({
        url: `${URL}/staff/without-attendance`,
        method: 'POST',
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        staff: data.staff || [],
    };
};

export const getLeaveTypes = async (): Promise<LeaveTypesResponseDataType> => {
    const response: LeaveTypesResponseType = await apiCall({
        url: `${URL}/leave-type/get-all`,
        method: 'POST',
    })

    return ({
        success: response.success,
        message: response.message,
        leaveTypes: response.data.leaveTypes || []
    });
};

export const createLeave = async (body: AttendanceMarkType): Promise<CreateLeaveResponseDataType> => {
    const response: CreateLeaveResponseType = await apiCall({
        url: `${URL}/attendance/add-leave`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            Attendance: response.data,
        },
    };
};

export const addAttendance = async (body: AttendanceMarkType): Promise<CreateLeaveResponseDataType> => {
    const response: CreateLeaveResponseType = await apiCall({
        url: `${URL}/attendance/time-in`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            Attendance: response.data,
        },
    };
};

export const addOutTime = async (body: OutTimeType): Promise<AddOutTimeResponseDataType> => {
    const response: AddOutTimeResponseType = await apiCall({
        url: `${URL}/attendance/time-out`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            test: response.data,
        },
    };
};

export const addInTime = async (body: InTimeType): Promise<AddInTimeResponseDataType> => {
    const response: AddInTimeResponseType = await apiCall({
        url: `${URL}/attendance/time-in`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            test: response.data,
        },
    };
};

export const getLeaves = async (page: number, limit?: number, date?: string): Promise<AbsentStaffsResponseDataType> => {
    const response: AbsentStaffsResponseType = await apiCall({
        url: `${URL}/attendance/leaves-by-date`,
        method: 'POST',
        body: { page, limit, date },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        leaves: data.leaves || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalLeaves: data.totalLeaves ?? 0,
    };
};

export const addLeave = async (date: string, staffId: number, leave: number): Promise<CreateLeaveResponseDataType> => {
    const response: CreateLeaveResponseType = await apiCall({
        url: `${URL}/attendance/leave-add`,
        method: 'POST',
        body: { date, staffId, leave },
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            Attendance: response.data,
        },
    };
};
