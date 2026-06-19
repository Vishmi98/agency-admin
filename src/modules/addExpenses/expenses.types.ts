/* eslint-disable no-unused-vars */
import { DropdownType } from "@/type/common.types";
import { StaffDataType } from "../staff/staff.types";

export type ExpenseType = {
    id: number;
    expenseType: number;
    amount: number;
    smallDescription: string;
    documentPath?: string;
    documentId?: number;
    createdBy: number;
    branchId: number;
    date: string;
}

export type ExpenseDataType = {
    id: number;
    expenseType: number;
    amount: number;
    smallDescription?: string;
    documentPath?: string;
    documentId?: string;
    date: string;
    createdBy: number;
    expenseTypeInfo: DropdownType;
    staffInfo: StaffDataType;
    branchInfo: DropdownType;
}

export type ExpenseFormValues = {
    handleClose: () => void;
    open: boolean;
    onExpenseAdded?: () => void;
}

export type CreateExpenseResponseType = {
    success: boolean;
    message: string;
    data: ExpenseType;
}

export type CreateExpenseResponseDataType = {
    success: boolean;
    message: string;
    data: {
        expense: ExpenseType;
    }
}

export type ExpensesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalExpenses: number;
    expenses: ExpenseDataType[];
}

export type ExpensesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalExpenses: number;
        expenses: ExpenseDataType[];
    }
}

export type ExpenseTableProps = {
    totalRows: number,
    expenses: ExpenseDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    reloadData: () => void
}

export type ExpensePageStateType = {
    expenses: ExpenseDataType[];
    isLoading: boolean;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
    isOpen: boolean;
}

export const expensePageInitialState: ExpensePageStateType = {
    expenses: [],
    isLoading: true,
    page: 1,
    limit: 5,
    totalRows: 0,
    search: "",
    isOpen: false
};

export const expensePageReducer = (state: ExpensePageStateType, action: { type: string; payload?: Partial<ExpensePageStateType> }) => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'reset':
            return expensePageInitialState;
        default:
            throw new Error('Invalid action type');
    }
};

export type ExpenseSearchProps = {
    onSearch: () => void;
    setSearch: (i: string) => void,
    search: string,
    loading: boolean,
    handleClearSearch: () => void
}