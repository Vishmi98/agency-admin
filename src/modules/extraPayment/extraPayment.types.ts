export type ExtraPaymentType = {
    id: number,
    title: string;
    amount: number | string;
    currency: string;
}

export type ExtraPaymentDataType = {
    id: number,
    title: {
        SN: string;
        EN: string;
        TM: string;
    };
    amount: number | string;
    currency: string;
}

export type ExtraPaymentResponseDataType = {
    success: boolean;
    message: string;
    extraPayments: ExtraPaymentDataType[];
}

export type ExtraPaymentResponseType = {
    success: boolean;
    message: string;
    data: {
        extraPayments: ExtraPaymentDataType[];
    }
}

export type CreateExtraPaymentResponseDataType = {
    success: boolean;
    message: string;
    data: {
        extraPayment: ExtraPaymentDataType;
    }
}

export type CreateExtraPaymentResponseType = {
    success: boolean;
    message: string;
    data: ExtraPaymentDataType;
}

export type bodyType = {
    title: {
        SN: string;
        EN: string;
        TM: string;
    };
    amount: number | string;
    currency: string;
}