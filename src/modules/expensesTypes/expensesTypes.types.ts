import { DropdownType } from "@/type/common.types";

export type ExpensesTypesResponseType = {
    success: boolean;
    message: string;
    data: { expenseTypes: DropdownType[] | [] };
}

export type ExpensesTypesResponseDataType = {
    success: boolean;
    message: string;
    expenseTypes: DropdownType[] | []
}

export type CreateExpensesTypeResponseDataType = {
    success: boolean;
    message: string;
    data: {
        expenseType: DropdownType;
    }
}

export type CreateExpensesTypeResponseType = {
    success: boolean;
    message: string;
    data: DropdownType;
}