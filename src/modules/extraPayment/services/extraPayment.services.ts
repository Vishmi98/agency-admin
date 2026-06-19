import { bodyType, CreateExtraPaymentResponseDataType, CreateExtraPaymentResponseType,  ExtraPaymentResponseDataType, ExtraPaymentResponseType } from "../extraPayment.types";

import { URL } from "@/constants/config";
import apiCall from "@/services/api.services";


export const getExtraPaymentData = async (): Promise<ExtraPaymentResponseDataType> => {
    const response: ExtraPaymentResponseType = await apiCall({
        url: `${URL}/extra-payment/get-all`,
        method: 'POST',
    });

    return {
        success: response.success,
        message: response.message,
        extraPayments: response.data.extraPayments || [],
    };
};

export const createExtraPayment = async (body: bodyType): Promise<CreateExtraPaymentResponseDataType> => {
    const response: CreateExtraPaymentResponseType = await apiCall({
        url: `${URL}/extra-payment/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            extraPayment: response.data,
        },
    };
};