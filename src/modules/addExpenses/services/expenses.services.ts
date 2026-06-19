import axios from "axios";
import { ExpensesResponseDataType, ExpensesResponseType } from "../expenses.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getExpensesData = async (page: number, limit?: number, search?: string): Promise<ExpensesResponseDataType> => {
    const response: ExpensesResponseType = await apiCall({
        url: `${URL}/expense/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    return {
        success: response.success,
        message: response.message,
        expenses: response.data.expenses,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        totalExpenses: response.data.totalExpenses,
    };
};

export const createExpense = async (data: FormData) => {
    const res = await axios.post(`${URL}/expense/create`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    const response = res.data; // <-- Important

    return {
        success: response.success,
        message: response.message,
        data: {
            expense: response.data.expense,
        },
    };
};
