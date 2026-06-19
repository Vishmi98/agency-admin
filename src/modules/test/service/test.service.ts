import { MyAttendanceResponseDataType, TodayAttendanceResponseDataType, TodayAttendanceResponseType } from "../test.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const fetchAttendance = async (date: string): Promise<TodayAttendanceResponseDataType> => {
    const response: TodayAttendanceResponseType = await apiCall({
        url: `${URL}/roster/get-by-date`,
        method: "POST",
        body: { date }, 
    });

    return {
        success: response.success ?? false,
        message: response.message || "No message provided",
        data: response.data ?? [], 
    };
};

export const getMyAttendance = async (date: string, userId: number): Promise<MyAttendanceResponseDataType> => {
    const response: MyAttendanceResponseDataType = await apiCall({
        url: `${URL}/roster/get-for-user`,
        method: "POST",
        body: { date, userId }, 
    });

    return {
        success: response.success ?? false,
        message: response.message || "No message provided",
        data: response.data ?? null, 
    };
};
