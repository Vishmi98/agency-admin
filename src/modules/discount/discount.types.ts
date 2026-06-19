import { ExtraPaymentDataType } from "../extraPayment/extraPayment.types";

export type DiscountsResponseDataType = {
    success: boolean;
    message: string;
    discounts: ExtraPaymentDataType[];
}

export type DiscountsResponseType = {
    success: boolean;
    message: string;
    data: {
        discounts: ExtraPaymentDataType[];
    }
}

export type DiscountFormValues = {
    handleClose: () => void;
    open: boolean;
    onDiscountAdded?: () => void;
}

export type CreateDiscountResponseDataType = {
    success: boolean;
    message: string;
    data: {
        discount: ExtraPaymentDataType;
    }
}

export type CreateDiscountResponseType = {
    success: boolean;
    message: string;
    data: ExtraPaymentDataType;
}