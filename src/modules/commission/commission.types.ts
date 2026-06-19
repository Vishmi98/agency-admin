import { InvoiceDataType } from "../invoice/invoice.types";
import { StaffDataType, StaffType } from "../staff/staff.types";
import { StudentType } from "../student/student.types";

export type MainCommissionFormValues = {
    handleReload: () => void;
    reload: boolean;
    invoices: InvoiceDataType[]
}

export type MainCommissionType = {
    date: string;
    invoiceId: number | string;
    studentId: number | string;
    packageId: number | string;
    uniId: number | string;
    branchId: number | string;
    staffId: number | string;
    amount: number;
    percentage: number;
    dueAmount: number;
    paidAmount: number;
    introduceAmount: number;
    monthlyAmount: number;
    status: "pending" | "available" | "paid";
    introduceAmountPaid: boolean;
}

export type CreateMainCommissionResponseType = {
    success: boolean;
    message: string;
    data: MainCommissionType;
}

export type CreateMainCommissionResponseDataType = {
    success: boolean;
    message: string;
    data: {
        commission: MainCommissionType;
    }
}

export type MainCommissionTableProps = {
    totalRows: number,
    mainCommissions: MainCommissionDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    selectedMainCommission: MainCommissionDataType | null,
    setSelectedMainCommission: (i: MainCommissionDataType) => void,
    reloadData: () => void
}

export type MainCommissionDataType = {
    id: number;
    date: string;
    invoiceId: number;
    studentId: number;
    packageId: number;
    uniId: number;
    branchId: number;
    staffId: number;
    amount: number;
    percentage: number;
    dueAmount: number;
    paidAmount: number;
    introduceAmount: number;
    monthlyAmount: number;
    status: "pending" | "available" | "paid";
    introduceAmountPaid: boolean;
    isAutoCreated: boolean;
    studentDetails?: StudentType,
    staffDetails?: StaffType,
}

export type MainCommissionResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalCommissions: number;
    commissions: MainCommissionDataType[];
}

export type MainCommissionResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalCommissions: number;
        commissions: MainCommissionDataType[];
    }
}

export type UpdateIntroduceAmountPaidResponseDataType = {
    success: boolean;
    message: string;
    data: MainCommissionType
}

export type SubCommissionFormValues = {
    handleReload: () => void;
    reload: boolean;
    mainCommissions: MainCommissionDataType[]
    staffs: StaffDataType[]
}

export type SubCommissionType = {
    commissionId: number | string;
    month: string;
    staffId: number | string;
    amount: number;
    paidDateAndTime: Date | null;
    status: "available" | "paid";
    isAutoCreated: boolean;
}

export type SubCommissionDataType = {
    id: number;
    commissionId: number;
    month: string;
    staffId: number;
    amount: number;
    paidDateAndTime: Date | null;
    status: "available" | "paid";
    isAutoCreated: boolean;
    mainCommissionInfo: MainCommissionDataType;
    staffInfo: StaffDataType;
}

export type CreateSubCommissionResponseType = {
    success: boolean;
    message: string;
    data: SubCommissionType;
}

export type CreateSubCommissionResponseDataType = {
    success: boolean;
    message: string;
    data: {
        commission: SubCommissionType;
    }
}

export type SubCommissionResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalCommissions: number;
    commissions: SubCommissionDataType[];
}

export type SubCommissionResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalCommissions: number;
        commissions: SubCommissionDataType[];
    }
}

export type UpdateStaffResponseDataType = {
    success: boolean;
    message: string;
    data: SubCommissionType
}

export type MainCommissionPageStateType = {
    mainCommissions: MainCommissionDataType[];
    isLoading: boolean;
    selectedMainCommission: MainCommissionDataType | null;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
}

export const mainCommissionPageInitialState: MainCommissionPageStateType = {
    mainCommissions: [],
    isLoading: true,
    selectedMainCommission: null,
    page: 0,
    limit: 5,
    totalRows: 0,
    search: "",
};

export const mainCommissionPageReducer = (state: MainCommissionPageStateType, action: { type: string; payload?: Partial<MainCommissionPageStateType> }) => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'reset':
            return mainCommissionPageInitialState;
        default:
            throw new Error('Invalid action type');
    }
};

export type CommissionSearchProps = {
    onSearch: () => void;
    setSearch: (i: string) => void,
    search: string,
    loading: boolean,
    handleClearSearch: () => void
}

export type SubCommissionTableProps = {
    totalRows: number,
    subCommissions: SubCommissionDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    selectedSubCommission: SubCommissionDataType | null,
    setSelectedSubCommission: (i: SubCommissionDataType) => void,
    reloadData: () => void
}

export type SubCommissionPageStateType = {
    subCommissions: SubCommissionDataType[];
    isLoading: boolean;
    selectedSubCommission: SubCommissionDataType | null;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
}

export const subCommissionPageInitialState: SubCommissionPageStateType = {
    subCommissions: [],
    isLoading: true,
    selectedSubCommission: null,
    page: 0,
    limit: 5,
    totalRows: 0,
    search: "",
};

export const subCommissionPageReducer = (state: SubCommissionPageStateType, action: { type: string; payload?: Partial<MainCommissionPageStateType> }) => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'reset':
            return subCommissionPageInitialState;
        default:
            throw new Error('Invalid action type');
    }
};