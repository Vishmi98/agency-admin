export type AddCommissionFormValues = {
    handleReload: () => void;
    reload: boolean;
}

export type CommissionType = {
    role: number;
    amount: number;
}

export type AddCommissionResponseType = {
    success: boolean;
    message: string;
    data: CommissionType;
}

export type AddCommissionResponseDataType = {
    success: boolean;
    message: string;
    data: {
        commission: CommissionType;
    }
}

export type CommissionDataType = {
    id: number;
    role: number;
    amount: number;
}

export type CommissionResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalCommission: number;
    commissions: CommissionDataType[];
}

export type CommissionResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalCommission: number;
        commissions: CommissionDataType[];
    }
}

export type CommissionByRoleResponseType = {
    success: boolean;
    message: string;
    data: CommissionDataType;
}