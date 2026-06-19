import { CreatePaymentResponseDataType, CreatePaymentResponseType, DeletedPaymentResponseDataType, DeletedPaymentResponseType, PaymentReminderResponseDataType, PaymentReminderResponseType, PaymentResponseDataType, PaymentResponseType, PaymentType } from "../payment.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";
import { FilterInvoiceType } from "@/modules/invoice/invoice.types";


export const getPaymentData = async (page: number, limit?: number, search?: string): Promise<PaymentResponseDataType> => {
    const response: PaymentResponseType = await apiCall({
        url: `${URL}/payment/get-all-details`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        payments: data.payments || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalPayments: data.totalPayments ?? 0,
    };
};

export const getArchivedPaymentData = async (page: number, limit?: number, search?: string): Promise<PaymentResponseDataType> => {
    const response: PaymentResponseType = await apiCall({
        url: `${URL}/payment/get-all-archived`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        payments: data.payments || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalPayments: data.totalPayments ?? 0,
    };
};

export const getAllPaymentsWithoutCommissionPaidInvoices = async (page: number, limit?: number, search?: string): Promise<PaymentResponseDataType> => {
    const response: PaymentResponseType = await apiCall({
        url: `${URL}/payment/get-all-payments`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        payments: data.payments || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalPayments: data.totalPayments ?? 0,
    };
};

export const createPayment = async (body: PaymentType): Promise<CreatePaymentResponseDataType> => {
    const response: CreatePaymentResponseType = await apiCall({
        url: `${URL}/payment/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            payment: response.data,
        },
    };
};

export const getFilterPayments = async (
    page: number,
    limit?: number,
    filters?: FilterInvoiceType
): Promise<PaymentResponseDataType> => {
    const response: PaymentResponseType = await apiCall({
        url: `${URL}/payment/filter`,
        method: 'POST',
        body: {
            page,
            limit: limit || 5,
            ...filters,
        },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        payments: data.payments || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalPayments: data.totalPayments ?? 0,
    };
};

export const getDeletedPaymentData = async (page: number, limit?: number, search?: string): Promise<DeletedPaymentResponseDataType> => {
    const response: DeletedPaymentResponseType = await apiCall({
        url: `${URL}/delete-payment/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        deletePayments: data.deletePayments || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalDeletePayments: data.totalDeletePayments ?? 0,
    };
};

export const deletePayment = async (paymentId: number): Promise<CreatePaymentResponseDataType> => {
    const response: CreatePaymentResponseType = await apiCall({
        url: `${URL}/payment/delete-by-id`,
        method: 'POST',
        body: { paymentId },
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            payment: response.data,
        },
    };
};

export const getPaymentReminderStatus = async (): Promise<PaymentReminderResponseDataType> => {
    const response: PaymentReminderResponseType = await apiCall({
        url: `${URL}/monthlyPay/status`,
        method: "GET", // 💡 Fixed: Must match your backend's GET export
    });

    const data = response.data ?? { showReminder: false, message: "" };

    return {
        success: response.success ?? false,
        showReminder: data.showReminder,
        message: data.message || "",
    };
};