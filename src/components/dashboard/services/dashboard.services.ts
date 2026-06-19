import { ThisWeekInvoicesResponseType, ThisWeekInvoicesType, TopSaleResponseType, TopSaleType } from "../dashboard.types";

import { URL } from "@/constants/config";
import apiCall from "@/services/api.services";


export const getThisWeekInvoices = async (): Promise<ThisWeekInvoicesType> => {
    const response: ThisWeekInvoicesResponseType = await apiCall({
        url: `${URL}/dashboard/this-week-invoices`,
        method: 'POST',
        body: {},
    });
    return {
        success: response.success,
        message: response.message,
        chartData: response.data.currentWeekInvoices,

    };
};

export const getTopSale = async (): Promise<TopSaleType> => {
    const response: TopSaleResponseType = await apiCall({
        url: `${URL}/dashboard/top-sale`,
        method: 'POST',
        body: {},
    });
    return {
        success: response.success,
        message: response.message,
        topSale: response.data.topStaffsCurrentMonth
    };
};
