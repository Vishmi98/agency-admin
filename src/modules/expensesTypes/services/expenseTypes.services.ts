import { CreateExpensesTypeResponseDataType, CreateExpensesTypeResponseType, ExpensesTypesResponseDataType, ExpensesTypesResponseType } from "../expensesTypes.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getExpensesTypesData = async (): Promise<ExpensesTypesResponseDataType> => {
    const response: ExpensesTypesResponseType = await apiCall({
        url: `${URL}/expenses-type/get-all`,
        method: 'POST',
    });

    return {
        success: response.success,
        message: response.message,
        expenseTypes: response.data.expenseTypes,
    };
};


export const createExpensesTypeSliderData = async (title: string): Promise<CreateExpensesTypeResponseDataType> => {
    const body = {
        title: {
            EN: title,
            SN: title,
            TM: title,
        },
    };

    const response: CreateExpensesTypeResponseType = await apiCall({
        url: `${URL}/expenses-type/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            expenseType: response.data,
        },
    };
};
