/* eslint-disable no-unused-vars */
import { DropdownType } from "@/type/common.types";

export type PackageType = {
    title: string;
    countryId: number | string;
    uniId: number | string;
    courseName: string;
    cost: number | string;
    price: number | string;
    startDate: string;
    qualification: string | number;
    duration: number | string;
    nextIntake: string;
    entryQualification: number[] | [];
    studyType: number | string;
    language: number | string;
    createdBy: number | string;
    costInLkr: number | string;
    priceInLkr: number | string;
}

export type PackageDataType = {
    id: number;
    title: string;
    countryId: number;
    uniId: number;
    courseName: string;
    cost: number;
    price: number;
    startDate: string;
    qualification: number;
    duration: number;
    nextIntake: string;
    entryQualification: number[] | [];
    studyType: number;
    language: number;
    createdBy: number;
    costInLkr: number | string;
    priceInLkr: number | string;
    uniInfo?: {
        id: number;
        name: string;
        city: string;
    };
    countryInfo?: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
    staffInfo?: {
        id: number;
        firstName: string;
        lastName: string;
    };
    studyTypeInfo?: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
    entryQualificationInfo: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
    qualificationInfo: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
    languageInfo: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
};

export type PackageResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalPackages: number;
    packages: PackageDataType[];
}

export type PackageResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalPackages: number;
        packages: PackageDataType[];
    }
}

export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

export type CreatePackageResponseType = {
    success: boolean;
    message: string;
    data: PackageType;
}

export type CreatePackageResponseDataType = {
    success: boolean;
    message: string;
    data: {
        package: PackageType;
    }
}

export type StudyTypesResponseType = {
    success: boolean;
    message: string;
    data: { studyTypes: DropdownType[] | [] };
}

export type StudyTypesResponseDataType = {
    success: boolean;
    message: string;
    studyTypes: DropdownType[] | []
}

export type LanguagesResponseType = {
    success: boolean;
    message: string;
    data: { languages: DropdownType[] | [] };
}

export type LanguagesResponseDataType = {
    success: boolean;
    message: string;
    languages: DropdownType[] | []
}

export type PackagePageStateType = {
    packages: PackageDataType[];
    isLoading: boolean;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
    isOpen: boolean;
};

export const packagePageInitialState: PackagePageStateType = {
    packages: [],
    isLoading: true,
    page: 0,
    limit: 5,
    totalRows: 0,
    search: "",
    isOpen: false
};

export const packagePageReducer = (
    state: PackagePageStateType,
    action: { type: string; payload?: Partial<PackagePageStateType> }
) => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'reset':
            return packagePageInitialState;
        default:
            throw new Error('Invalid action type');
    }
};

export type PackageTableProps = {
    totalRows: number,
    packages: PackageDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    reloadData: () => void
}

export type PackageSearchProps = {
    onSearch: () => void;
    setSearch: (i: string) => void,
    search: string,
    loading: boolean,
    handleClearSearch: () => void
}


export type UpdatePackageModalProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: { id: number; costInLkr: number | string; priceInLkr: number | string }) => void;
    packageData: PackageDataType | null;
};
