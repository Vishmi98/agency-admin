import { AddDiscountType, CreateInvoiceResponseDataType, CreateInvoiceResponseType, DeletedInvoicesResponseDataType, DeletedInvoicesResponseType, DueInvoicesResponseDataType, DueInvoicesResponseType, FilterInvoiceType, InvoiceBodyType, InvoicesResponseDataType, InvoicesResponseType, PendingPaymentInvoicesResponseDataType, PendingPaymentInvoicesResponseType, StudentsNotHAveInvoicesResponseDataType, StudentsNotHAveInvoicesResponseType, UpdateInvoicePackageType, UpdateInvoiceResponseDataType, UpdateInvoiceResponseType, UpdateInvoiceStatusResponseDataType, UpdateInvoiceStatusResponseType, UpdateInvoiceToCommissionAvailableResponseDataType, UpdateInvoiceToCommissionAvailableResponseType, UpdateInvoiceType } from "../invoice.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getArchivedInvoiceData = async (page: number, limit?: number, search?: string): Promise<InvoicesResponseDataType> => {
    const response: InvoicesResponseType = await apiCall({
        url: `${URL}/invoice/get-all-archived`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        invoices: data.invoices || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalInvoices: data.totalInvoices ?? 0,
    };
};

export const getInvoiceData = async (page: number, limit?: number, search?: string): Promise<InvoicesResponseDataType> => {
    const response: InvoicesResponseType = await apiCall({
        url: `${URL}/invoice/get-all-details`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        invoices: data.invoices || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalInvoices: data.totalInvoices ?? 0,
    };
};

export const getInvoicesNotUpdatePackage = async (page: number, limit?: number, search?: string): Promise<InvoicesResponseDataType> => {
    const response: InvoicesResponseType = await apiCall({
        url: `${URL}/invoice/get-not-update-package`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        invoices: data.invoices || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalInvoices: data.totalInvoices ?? 0,
    };
};

export const getUpdatedPackageInvoices = async (page: number, limit?: number, search?: string): Promise<InvoicesResponseDataType> => {
    const response: InvoicesResponseType = await apiCall({
        url: `${URL}/invoice/get-package-updated-invoices`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        invoices: data.invoices || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalInvoices: data.totalInvoices ?? 0,
    };
};

export const getAllInvoicesWithoutCommissionPaid = async (page: number, limit?: number, search?: string): Promise<InvoicesResponseDataType> => {
    const response: InvoicesResponseType = await apiCall({
        url: `${URL}/invoice/get-all-invoices`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        invoices: data.invoices || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalInvoices: data.totalInvoices ?? 0,
    };
};

export const getUpdateStatusInvoiceData = async (page: number, limit?: number, search?: string, statusId?: number): Promise<UpdateInvoiceStatusResponseDataType> => {
    const response: UpdateInvoiceStatusResponseType = await apiCall({
        url: `${URL}/invoice/by-status`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '', statusId },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        invoices: data.invoices || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        invoiceCount: data.invoiceCount ?? 0,
    };
};

export const createInvoice = async (body: InvoiceBodyType): Promise<CreateInvoiceResponseDataType> => {

    const response: CreateInvoiceResponseType = await apiCall({
        url: `${URL}/invoice/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            invoice: response.data,
        },
    };
};

export const updateInvoice = async (body: UpdateInvoiceType): Promise<UpdateInvoiceResponseDataType> => {
    const response: UpdateInvoiceResponseType = await apiCall({
        url: `${URL}/invoice/update`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            invoice: response.data,
        },
    };
};

export const updateInvoicePackage = async (body: UpdateInvoicePackageType): Promise<UpdateInvoiceResponseDataType> => {
    const response: UpdateInvoiceResponseType = await apiCall({
        url: `${URL}/invoice/update-package`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            invoice: response.data,
        },
    };
};

export const addDiscount = async (body: AddDiscountType): Promise<UpdateInvoiceResponseDataType> => {
    const response: UpdateInvoiceResponseType = await apiCall({
        url: `${URL}/invoice/add-discounts`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            invoice: response.data,
        },
    };
};

export const updateInvoiceStatus = async (id: number, status: number): Promise<UpdateInvoiceResponseDataType> => {
    const response: UpdateInvoiceResponseType = await apiCall({
        url: `${URL}/invoice/update-status`,
        method: 'POST',
        body: { id, status },
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            invoice: response.data,
        },
    };
};

export const updateInvoiceStatusToCommissionAvailable = async (id: number, status: number): Promise<UpdateInvoiceToCommissionAvailableResponseDataType> => {
    const response: UpdateInvoiceToCommissionAvailableResponseType = await apiCall({
        url: `${URL}/invoice/update-status-commission-available`,
        method: 'POST',
        body: { id, status },
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            invoice: response.invoice,
            commission: response.commission
        },
    };
};

export const getFilterInvoices = async (
    page: number,
    limit?: number,
    filters?: FilterInvoiceType
): Promise<InvoicesResponseDataType> => {
    const response: InvoicesResponseType = await apiCall({
        url: `${URL}/invoice/filter`,
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
        invoices: data.invoices || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalInvoices: data.totalInvoices ?? 0,
    };
};

export const getPendingPaymentInvoices = async (
    page: number,
    limit?: number,
    filters?: FilterInvoiceType
): Promise<PendingPaymentInvoicesResponseDataType> => {
    const response: PendingPaymentInvoicesResponseType = await apiCall({
        url: `${URL}/invoice/pending-payment-invoices`,
        method: 'POST',
        body: {
            page,
            limit: limit || 5,
            ...filters,
        }
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        invoices: data.invoices || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        invoiceCount: data.invoiceCount ?? 0,
    };
};

export const getStudentNotHaveInvoice = async (page: number, limit?: number, search?: string): Promise<StudentsNotHAveInvoicesResponseDataType> => {
    const response: StudentsNotHAveInvoicesResponseType = await apiCall({
        url: `${URL}/student/get-student-not-have-invoice`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        students: data.students || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalStudents: data.totalStudents ?? 0,
    };
};

export const commissionPaid = async (id: number, status: number): Promise<UpdateInvoiceResponseDataType> => {
    const response: UpdateInvoiceResponseType = await apiCall({
        url: `${URL}/invoice/commission-paid`,
        method: 'POST',
        body: { id, status },
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            invoice: response.data,
        },
    };
};

export const getDueInvoiceData = async (page: number, limit?: number, search?: string): Promise<DueInvoicesResponseDataType> => {
    const response: DueInvoicesResponseType = await apiCall({
        url: `${URL}/invoice/get-due-invoices`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        invoices: data.invoices || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        invoiceCount: data.invoiceCount ?? 0,
    };
};

export const getDeletedInvoiceData = async (page: number, limit?: number, search?: string): Promise<DeletedInvoicesResponseDataType> => {
    const response: DeletedInvoicesResponseType = await apiCall({
        url: `${URL}/delete-invoice/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        deletedInvoices: data.deletedInvoices || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalDeleteInvoices: data.totalDeleteInvoices ?? 0,
    };
};

export const deleteInvoice = async (invoiceId: number): Promise<UpdateInvoiceResponseDataType> => {
    const response: UpdateInvoiceResponseType = await apiCall({
        url: `${URL}/invoice/delete-by-id`,
        method: 'POST',
        body: { invoiceId },
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            invoice: response.data,
        },
    };
};

export const getInvoicesWithoutMainCommission = async (page: number, limit?: number): Promise<InvoicesResponseDataType> => {
    const response: InvoicesResponseType = await apiCall({
        url: `${URL}/invoice/without-commission`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        invoices: data.invoices || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalInvoices: data.totalInvoices ?? 0,
    };
};