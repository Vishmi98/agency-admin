import { AccountsResponseDataType, AccountsResponseType } from "../account.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getAccountsByMonth = async (month?: string): Promise<AccountsResponseDataType> => {
    const response: AccountsResponseType = await apiCall({
        url: `${URL}/account/get-all`,
        method: 'POST',
        body: { ...(month && { month }) },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        accounts: data.accounts || [],
        totalIncome: data.totalIncome ?? 0,
        totalExpenses: data.totalExpenses ?? 0,
        profit: data.profit ?? 0,
    };
};
