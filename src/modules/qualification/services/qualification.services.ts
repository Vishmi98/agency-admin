import { CreateQualificationResponseDataType, CreateQualificationResponseType, QualificationsResponseDataType, QualificationsResponseType } from "../qualification.types";

import { URL } from "@/constants/config";
import apiCall from "@/services/api.services";


export const getQualificationData = async (): Promise<QualificationsResponseDataType> => {
    const response: QualificationsResponseType = await apiCall({
        url: `${URL}/qualification/get-all`,
        method: 'POST',
    })

    return ({
        success: response.success,
        message: response.message,
        qualifications: response.data.qualifications || [],
    });
};

export const createQualification = async (title: string): Promise<CreateQualificationResponseDataType> => {
    const body = {
        title: {
            EN: title,
            SN: title,
            TM: title,
        },
    };

    const response: CreateQualificationResponseType = await apiCall({
        url: `${URL}/qualification/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            qualification: response.data,
        },
    };
};