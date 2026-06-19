/* eslint-disable no-unused-vars */
import { FilterValues, InvoiceDataType } from "../invoice/invoice.types";
import { StudentDataType } from "../student/student.types";
import { StaffDataType } from "../staff/staff.types";

export type PaymentType = {
    invoiceId: number | string;
    paymentDate: string;
    amountUsd: number | string;
    amountLkr: number | string;
    paymentType: number | string;
    createdBy: number | string;
    studentId?: number | string;
    branchId: number | string;
}

export type PaymentDataType = {
    id: number;
    invoiceId: number;
    paymentDate: string;
    amountLkr: number;
    studentId: number;
    paymentType: number;
    createdBy: number;
    invoiceInfo: InvoiceDataType;
    studentInfo: StudentDataType;
    staffInfo?: StaffDataType;
    branchInfo: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
    paymentTypeInfo?: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
}

export type PaymentResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalPayments: number;
    payments: PaymentDataType[];
}

export type PaymentResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalPayments: number;
        payments: PaymentDataType[];
    }
}

export type CreatePaymentResponseType = {
    success: boolean;
    message: string;
    data: PaymentType;
}

export type CreatePaymentResponseDataType = {
    success: boolean;
    message: string;
    data: {
        payment: PaymentType;
    }
}

export type PaymentSearchProps = {
    onSearch: () => void;
    setSearch: (i: string) => void,
    search: string,
    loading: boolean,
    handleClearSearch: () => void
}

export type PaymentTableProps = {
    totalRows: number,
    payments: PaymentDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    selectedPayment: PaymentDataType | null,
    setSelectedPayment: (i: PaymentDataType) => void,
    reloadData: () => void
}

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export type PaymentPageStateType = {
    payments: PaymentDataType[];
    isLoading: boolean;
    selectedPayment: PaymentDataType | null;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
    isOpen: boolean;
    filters?: FilterValues;
}

export const paymentPageInitialState: PaymentPageStateType = {
    payments: [],
    isLoading: true,
    selectedPayment: null,
    page: 0,
    limit: 5,
    totalRows: 0,
    search: "",
    isOpen: false,
    filters: {
        startDate: formatDate(yesterday),
        endDate: formatDate(today),
        universityId: 0,
        staffId: 0
    }
};

export const paymentPageReducer = (state: PaymentPageStateType, action: { type: string; payload?: Partial<PaymentPageStateType> }) => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'reset':
            return paymentPageInitialState;
        default:
            throw new Error('Invalid action type');
    }
};

export type DeletedPaymentResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalDeletePayments: number;
    deletePayments: PaymentDataType[];
}

export type DeletedPaymentResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalDeletePayments: number;
        deletePayments: PaymentDataType[];
    }
}

export type PaymentProp = {
    payment: PaymentDataType,
    setIsModalOpen: (open: boolean) => void
}

export interface PaymentReminderResponseData {
    showReminder: boolean;
    message?: string;
}

export interface PaymentReminderResponseType {
    success: boolean;
    data?: PaymentReminderResponseData; // <--- properly typed
    message?: string;
}

export interface PaymentReminderResponseDataType {
    success: boolean;
    showReminder: boolean;
    message?: string;
}
