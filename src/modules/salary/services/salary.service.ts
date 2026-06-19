import { AddBasicAndCommissionResponseDataType, AddBasicAndCommissionResponseType } from "../salary.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const addBasicSalary = async (staffId: string | number, basicSalary: number): Promise<AddBasicAndCommissionResponseDataType> => {
    const response: AddBasicAndCommissionResponseType = await apiCall({
        url: `${URL}/staff/add-basic-salary`,
        method: 'POST',
        body: { staffId, basicSalary }
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            staff: response.data,
        },
    };
};

export const addCommissionAmount = async (staffId: string | number, commissionAmount: number): Promise<AddBasicAndCommissionResponseDataType> => {
    const response: AddBasicAndCommissionResponseType = await apiCall({
        url: `${URL}/staff/add-commission-amount`,
        method: 'POST',
        body: { staffId, commissionAmount }
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            staff: response.data,
        },
    };
};