import { CreateRoasterResponseDataType, CreateRoasterResponseType, CreateRosterRequest, RoasterResponseDataType, RoasterResponseType, StaffRoasterResponseDataType, StaffRoasterResponseType, NoRosterMonthsResponseDataType, NoRosterMonthsResponseType, RosterByIdResponseType, RosterByIdResponseDataType } from "../attendance.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getRoaster = async (rosterId: string, month: string): Promise<RoasterResponseDataType> => {
    const response: RoasterResponseType = await apiCall({
        url: `${URL}/roster/get-all-by-id`,
        method: 'POST',
        body: { month, rosterId },
    });

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        rosters: response.data.rosters || [],
        holidays: response.data.holidays || [],
    };
};

export const createRoaster = async (body: CreateRosterRequest): Promise<CreateRoasterResponseDataType> => {
    const response: CreateRoasterResponseType = await apiCall({
        url: `${URL}/roster/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            rosters: response.data,
        },
    };
};

export const getRosterStaffData = async (month: string): Promise<StaffRoasterResponseType> => {
    const response: StaffRoasterResponseDataType = await apiCall({
        url: `${URL}/roster/get-init-data`,
        method: 'POST',
        body: { month },
    });

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        monthData: response.data.monthData || [],
        staffData: response.data.staffData || []
    };
};

export const getNoRosterMonths = async (): Promise<NoRosterMonthsResponseDataType> => {
    const response: NoRosterMonthsResponseType = await apiCall({
        url: `${URL}/month/get-no-roster`,
        method: 'POST',
    });

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        data: response.data ?? [], // Include the actual data array
    };
};

export const getRosterById  = async ( rosterId: string, date: string, staffId: number ): Promise<RosterByIdResponseType> => {
    const response: RosterByIdResponseDataType = await apiCall({
        url: `${URL}/roster/get-by-id`,
        method: 'POST',
        body: { rosterId, date, staffId },
    });

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        staffInfo: response.data?.staffInfo || [],
        shiftInfo: response.data?.shiftInfo || [],
        rosterId: response.data?.rosterId,
        shiftId: response.data?.shiftId,
        date: response.data?.date,
        staffId: response.data?.staffId
    };
};

export const editShift  = async ( rosterId: string, date: string, staffId: number, shiftId: number ): Promise<RosterByIdResponseType> => {
    const response: RosterByIdResponseDataType = await apiCall({
        url: `${URL}/roster/update-shift`,
        method: 'POST',
        body: { rosterId, date, staffId, shiftId },
    });

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        staffInfo: response.data?.staffInfo || [],
        shiftInfo: response.data?.shiftInfo || [],
        rosterId: response.data?.rosterId,
        shiftId: response.data?.shiftId,
        date: response.data?.date,
        staffId: response.data?.staffId
    };
};