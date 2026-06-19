import { DropdownType } from "@/type/common.types";


export type TableProps = {
    refreshFlag: boolean;
}

export type QualificationsResponseType = {
    success: boolean;
    message: string;
    data: { qualifications: DropdownType[] | [] };
}

export type QualificationsResponseDataType = {
    success: boolean;
    message: string;
    qualifications: DropdownType[] | []
}

export type CreateQualificationResponseDataType = {
    success: boolean;
    message: string;
    data: {
        qualification: DropdownType;
    }
}

export type CreateQualificationResponseType = {
    success: boolean;
    message: string;
    data: DropdownType;
}