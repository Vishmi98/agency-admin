import { CreatePaymentTypeResponseDataType, CreatePaymentTypeResponseType, PaymentTypesResponseDataType, PaymentTypesResponseType } from "../paymentTypes.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getPaymentTypes = async (): Promise<PaymentTypesResponseDataType> => {
    const response: PaymentTypesResponseType = await apiCall({
        url: `${URL}/payment-type/get-all`,
        method: 'POST',
        isAuth: true
    })

    return ({
        success: response.success,
        message: response.message,
        paymentTypes: response.data.paymentTypes || [],
    });
};

export const createPaymentTypeSliderData = async (title: string): Promise<CreatePaymentTypeResponseDataType> => {
    const body = {
        title: {
            EN: title,
            SN: title,
            TM: title,
        },
    };

    const response: CreatePaymentTypeResponseType = await apiCall({
        url: `${URL}/payment-type/create`,
        method: 'POST',
        body: body,
        isAuth: true
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            paymentType: response.data,
        },
    };
};