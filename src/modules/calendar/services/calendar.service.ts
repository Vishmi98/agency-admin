import { CreatePoyaDaysResponseDataType, CreatePoyaDaysResponseType, PoyaDaysResponseDataType, PoyaDaysResponseType } from "../calendar.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const createMonth = async (dates: string[], workingDays: number, month: string): Promise<CreatePoyaDaysResponseDataType> => {
    const response: CreatePoyaDaysResponseType = await apiCall({
        url: `${URL}/month/create`,
        method: 'POST',
        body: { dates, workingDays, month },
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            month: response.month,
            dates: response.dates,
            workDays: response.workDays
        },
    };
};

export const getPoyaDays = async (months: string[]): Promise<PoyaDaysResponseDataType> => {
    const response: PoyaDaysResponseType = await apiCall({
        url: `${URL}/month/get-all`,
        method: 'POST',
        body: { months },
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            months: response.data.months,
        },
    };
};

