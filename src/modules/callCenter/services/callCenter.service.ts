import { CallCenterCallType, CallsResponseDataType, CallsResponseType, CreateCallResponseDataType, CreateCallResponseType, UpdateCallResponseDataType, UpdateCallResponseType } from "../callCenter.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getCallsData = async (page: number, limit?: number): Promise<CallsResponseDataType> => {
    const response: CallsResponseType = await apiCall({
        url: `${URL}/callCenterCall/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        calls: data.calls || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalCalls: data.totalCalls ?? 0,
    };
};

export const createCall = async (body: CallCenterCallType): Promise<CreateCallResponseDataType> => {
    const response: CreateCallResponseType = await apiCall({
        url: `${URL}/callCenterCall/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            newCall: response.data,
        },
    };
};

export const submitResponse = async (callId: number, response_: string, checkBy: number): Promise<UpdateCallResponseDataType> => {
    const response: UpdateCallResponseType = await apiCall({
        url: `${URL}/callCenterCall/submit-response`,
        method: 'POST',
        body: { callId, response_, checkBy },
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            updatedCall: response.data,
        },
    };
};