/* eslint-disable no-unused-vars */
import { MainCommissionType } from "../commission/commission.types";
import { ExtraPaymentDataType } from "../extraPayment/extraPayment.types";
import { PackageDataType } from "../packages/package.types";
import { StaffDataType } from "../staff/staff.types";
import { StudentDataType } from "../student/student.types";


export type InvoiceType = {
    id: number;
    packageId: number | string;
    invoiceDate: string,
    totalPrice: number | string;
    studentId: number | string;
    staffId: number | string;
    extraPayment: number[] | [];
    selectedExtraPayment: string | number;
    currency: string;
    branchId: number | string;
    status?: number | string;
    discount: number[] | [];
    selectedDiscount: string | number;
    exchangeRate: number;
    updatePackageId: number | string;
};

export type UpdateInvoiceType = {
    due: number,
    id: number,
    newPaymentType: number[],
    total: number,
};

export type UpdateInvoicePackageType = {
    id: number,
    updatePackageId: number,
    total: number,
    due: number,
    difference: number
};

export type AddDiscountType = {
    due: number,
    id: number,
    newDiscountType: number[],
    total: number,
};

export type InvoiceBodyType = {
    id: number;
    packageId: number | string;
    invoiceDate: string,
    extraPayment: number[] | [];
    totalPrice: number | string;
    studentId: number | string;
    staffId: number | string;
    selectedExtraPayment: string | number;
    exchangeRate: number;
};

export type InvoiceDataType = {
    id: number;
    packageId: number;
    invoiceDate: string,
    extraPayment: number[] | [];
    discount: number[] | [];
    totalPrice: number;
    dueAmount: number;
    studentId: number;
    staffId: number;
    exchangeRate: number;
    currency?: string;
    branchId: number;
    status: number;
    packageInfo: PackageDataType;
    package: PackageDataType;
    updatePackage: PackageDataType;
    extraPaymentInfo: {
        id: number;
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        amount: number;
        currency?: string;
    }[];
    discountInfo: {
        id: number;
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        amount: number;
        currency?: string;
    }[];
    studentInfo?: StudentDataType;
    staffInfo?: StaffDataType;
    branchInfo: {
        id: number;
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
    };
    paymentInfo: {
        id: number,
        paymentDate: string,
        amountLkr: number
    }[];
    statusInfo: {
        id: number;
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        color: string;
    },
    updatePackageId: number;
    packagePriceUpdatePrice: number;
    difference: number;
};

export type InvoicesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalInvoices: number;
    invoices: InvoiceDataType[];
}

export type InvoicesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalInvoices: number;
        invoices: InvoiceDataType[];
    }
}

export type DeletedInvoicesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalDeleteInvoices: number;
    deletedInvoices: InvoiceDataType[];
}

export type DeletedInvoicesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalDeleteInvoices: number;
        deletedInvoices: InvoiceDataType[];
    }
}

export type UpdateInvoiceStatusResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    invoiceCount: number;
    invoices: InvoiceDataType[];
}

export type UpdateInvoiceStatusResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        invoiceCount: number;
        invoices: InvoiceDataType[];
    }
}

export type CreateInvoiceResponseType = {
    success: boolean;
    message: string;
    data: InvoiceType;
}

export type CreateInvoiceResponseDataType = {
    success: boolean;
    message: string;
    data: {
        invoice: InvoiceType;
    }
}

export type UpdateInvoiceResponseDataType = {
    success: boolean;
    message: string;
    data: {
        invoice: InvoiceType;
    }
}

export type UpdateInvoiceResponseType = {
    success: boolean;
    message: string;
    data: InvoiceType;
}

export type UpdateInvoiceToCommissionAvailableResponseDataType = {
    success: boolean;
    message: string;
    data: {
        invoice: InvoiceType;
        commission: MainCommissionType;
    }
}

export type UpdateInvoiceToCommissionAvailableResponseType = {
    success: boolean;
    message: string;
    invoice: InvoiceType;
    commission: MainCommissionType;
}

export type InvoiceSearchProps = {
    onSearch: () => void;
    setSearch: (i: string) => void,
    search: string,
    loading: boolean,
    handleClearSearch: () => void
}

export type InvoiceTableProps = {
    totalRows: number,
    invoices: InvoiceDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    selectedInvoice: InvoiceDataType | null,
    setSelectedInvoice: (i: InvoiceDataType) => void,
    reloadData: () => void
}

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export type InvoicePageStateType = {
    invoices: InvoiceDataType[];
    isLoading: boolean;
    selectedInvoice: InvoiceDataType | null;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
    filters?: FilterValues;
}

export const invoicePageInitialState: InvoicePageStateType = {
    invoices: [],
    isLoading: true,
    selectedInvoice: null,
    page: 0,
    limit: 5,
    totalRows: 0,
    search: "",
    filters: {
        startDate: formatDate(yesterday),
        endDate: formatDate(today),
        universityId: 0,
        staffId: 0
    }
};

export const invoicePageReducer = (state: InvoicePageStateType, action: { type: string; payload?: Partial<InvoicePageStateType> }) => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'reset':
            return invoicePageInitialState;
        default:
            throw new Error('Invalid action type');
    }
};

export type InvoiceProp = {
    invoice: InvoiceDataType,
    setIsModalOpen: (open: boolean) => void
}

export type FilterInvoiceType = {
    startDate: string;
    endDate: string;
    universityId: number;
    staffId: number;
};

export type FilterProps = {
    onSubmit: (values: {
        startDate: string;
        endDate: string;
        universityId: number;
        staffId: number;
    }) => void;
}

export type FilterValues = {
    startDate: string;
    endDate: string;
    universityId: number;
    staffId: number;
}

export type PendingPaymentInvoicesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    invoiceCount: number;
    invoices: InvoiceDataType[];
}

export type PendingPaymentInvoicesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        invoiceCount: number;
        invoices: InvoiceDataType[];
    }
}

export type StudentsNotHAveInvoicesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalStudents: number;
    students: StudentDataType[];
}

export type StudentsNotHAveInvoicesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalStudents: number;
        students: StudentDataType[];
    }
}

export type PendingPaymentInvoicesType = {
    totalRows: number;
    invoices: InvoiceDataType[];
    isLoading: boolean;
    page: number;
    limit: number;
    onPageChange: (newPage: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
}

export type AddedExtraPaymentsProps = {
    selectedExtraPayments: ExtraPaymentDataType[];
    selectedDiscounts: ExtraPaymentDataType[];
    totalPrice: number;
    selectedPackagePrice: number | undefined;
    calculateTotalPrice: () => void;
    removeExtraPayment: (id: number) => void;
    removeDiscount: (id: number) => void;
}

export type AddedExtraPaymentsType = {
    selectedExtraPayments: ExtraPaymentDataType[];
    selectedInvoice: InvoiceDataType | null;
    totalPrice: number;
    removeExtraPayment: (id: number) => void;
}

export type AddedDiscountsType = {
    selectedDiscounts: ExtraPaymentDataType[];
    selectedInvoice: InvoiceDataType | null;
    totalPrice: number;
    removeDiscount: (id: number) => void;
}

export type DueInvoicesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    invoiceCount: number;
    invoices: InvoiceDataType[];
}

export type DueInvoicesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        invoiceCount: number;
        invoices: InvoiceDataType[];
    }
}