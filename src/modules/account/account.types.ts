import { ExpenseDataType } from "../addExpenses/expenses.types";
import { PaymentDataType } from "../payment/payment.types";

export type SearchProps = {
    onSearch: (date: string) => void;
}

export type AccountsTableProps = {
    reload?: boolean;
    handleReload: () => void;
    month: string
    onTotalsChange?: (totals: { totalIncome: number; totalExpenses: number; profit: number }) => void;
}

export type AccountsDataType = {
    id: number;
    type: "income" | "expense" | "salary";
    sourceId: number; // links to Expense.id or Payment.id
    amount: number;
    description?: string;
    expenseType?: number; // only for expenses
    studentId?: number; // only for payments
    branchId?: number; // only for payments
    paymentType?: number; // only for payments
    createdBy: number;
    date: string;
    expenseInfo: ExpenseDataType,
    paymentInfo: PaymentDataType
}

export type AccountsResponseDataType = {
    success: boolean;
    message: string;
    accounts: AccountsDataType[];
    totalIncome: number,
    totalExpenses: number,
    profit: number
}

export type AccountsResponseType = {
    success: boolean;
    message: string;
    data: {
        accounts: AccountsDataType[];
        totalIncome: number,
        totalExpenses: number,
        profit: number
    }
}