import { DropdownType } from "@/type/common.types";


export type PaymentTypesResponseType = {
    success: boolean;
    message: string;
    data: { paymentTypes: DropdownType[] | [] };
}

export type PaymentTypesResponseDataType = {
    success: boolean;
    message: string;
    paymentTypes: DropdownType[] | []
}

export type CreatePaymentTypeResponseDataType = {
    success: boolean;
    message: string;
    data: {
        paymentType: DropdownType;
    }
}

export type CreatePaymentTypeResponseType = {
    success: boolean;
    message: string;
    data: DropdownType;
}
