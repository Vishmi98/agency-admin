import { CreateDiscountResponseDataType, CreateDiscountResponseType, DiscountsResponseDataType, DiscountsResponseType } from "../discount.types";

import { bodyType } from "@/modules/extraPayment/extraPayment.types";
import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getDiscountData = async (): Promise<DiscountsResponseDataType> => {
    const response: DiscountsResponseType = await apiCall({
        url: `${URL}/discount/get-all`,
        method: 'POST',
    });

    return {
        success: response.success,
        message: response.message,
        discounts: response.data.discounts || [],
    };
};

export const createDiscount = async (body: bodyType): Promise<CreateDiscountResponseDataType> => {
    const response: CreateDiscountResponseType = await apiCall({
        url: `${URL}/discount/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            discount: response.data,
        },
    };
};