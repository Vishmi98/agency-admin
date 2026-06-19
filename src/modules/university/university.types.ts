/* eslint-disable no-unused-vars */
import { WebCountryDataType } from "../countries/countries.types";

export type UniversityType = {
    id: number;
    name: string;
    address: string;
    countryId: number | string;
    phoneNumber: string;
    email: string;
    isPublish: boolean;
    staffId: number | string;
    rank: number | string;
    code: string | number;
    avatarPath?: string;
    avatarFileId?: string;
}

export type UniversitySearchValue = {
    universityName: string;
}

export type UniversitiesResponseType = {
    success: boolean;
    message: string;
    data: UniversityType[];
}

export type UniversitiesTableProps = {
    details: UniversityType[];
}

export type UniversityFormValues = {
    handleClose: () => void;
    open: boolean;
    handleReload: () => void;
}

export type UniversityDataType = {
    id: number;
    name: string;
    address: string;
    countryId: number;
    staffId: number;
    rank: number;
    code: number;
    phoneNumber: string;
    email: string;
    isPublish: boolean;
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
};

export type UniversityResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalUniversities: number;
    universities: UniversityDataType[];
}

export type UniversityResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalUniversities: number;
        universities: UniversityDataType[];
    }
}

export type CreateUniversityResponseType = {
    success: boolean;
    message: string;
    data: UniversityType;
}

export type CreateUniversityResponseDataType = {
    success: boolean;
    message: string;
    data: {
        university: UniversityType;
    }
}

export type UniversitiesByCountryIdResponseDataType = {
    success: boolean;
    message: string;
    universities: UniversityDataType[];
}

export type UniversitiesByCountryIdResponseType = {
    success: boolean;
    message: string;
    data: {
        universities: UniversityDataType[];
    }
}

export type UniversityPaymentType = {
    id: number;
    invoiceId: number | string;
    paymentType: number | string;
    documentPath?: string;
    documentId?: number;
    createdBy: number | string;
    date: string;
}

export type UniversityPaymentDataType = {
    id: number;
    invoiceId: number;
    paymentType: number;
    documentPath?: string;
    documentId?: string;
    createdBy: number;
    invoiceInfo: {
        id: number,
        packageId: number,
        packageInfo: {
            id: number,
            title: string
        }
    };
    staffInfo?: {
        id: number;
        fullName: string;
    };
    paymentTypeInfo: {
        id: number;
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
    };
    date: string;
}

export type CreateUniversityPaymentResponseType = {
    success: boolean;
    message: string;
    data: UniversityPaymentType;
}

export type CreateUniversityPaymentResponseDataType = {
    success: boolean;
    message: string;
    data: {
        universityPayment: UniversityPaymentType;
    }
}

export type UniversityPaymentsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalUniversityPayments: number;
    universityPayments: UniversityPaymentDataType[];
}

export type UniversityPaymentsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalUniversityPayments: number;
        universityPayments: UniversityPaymentDataType[];
    }
}

export type UniversityPaymentPageStateType = {
    universityPayments: UniversityPaymentDataType[];
    isLoading: boolean;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
    isOpen: boolean;
}

export const universityPaymentPageInitialState: UniversityPaymentPageStateType = {
    universityPayments: [],
    isLoading: true,
    page: 1,
    limit: 5,
    totalRows: 0,
    search: "",
    isOpen: false
};

export const universityPaymentPageReducer = (state: UniversityPaymentPageStateType, action: { type: string; payload?: Partial<UniversityPaymentPageStateType> }) => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'reset':
            return universityPaymentPageInitialState;
        default:
            throw new Error('Invalid action type');
    }
};

export type UniversityPaymentsTableProps = {
    totalRows: number,
    universityPayments: UniversityPaymentDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    reloadData: () => void
}

export type FilterUniversityTableProps = {
    totalRows: number,
    universities: UniversityDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    reloadData: () => void
}

export type FilterValues = {
    staffId: number;
    countryId: number;
}

export type UniversityReportPageStateType = {
    universities: UniversityDataType[];
    isLoading: boolean;
    selectedUniversity: UniversityDataType | null;
    page: number;
    limit: number;
    totalRows: number;
    filters?: FilterValues;
}

export const universityReportPageInitialState: UniversityReportPageStateType = {
    universities: [],
    isLoading: true,
    selectedUniversity: null,
    page: 0,
    limit: 5,
    totalRows: 0,
    filters: {
        countryId: 0,
        staffId: 0
    }
};

export const universityReportPageReducer = (state: UniversityReportPageStateType, action: { type: string; payload?: Partial<UniversityReportPageStateType> }) => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'reset':
            return universityReportPageInitialState;
        default:
            throw new Error('Invalid action type');
    }
};

export type FilterUniversityReportType = {
    countryId?: number;
    staffId?: number;
};

export type FilterProps = {
    onSubmit: (values: {
        countryId: number;
        staffId: number;
    }) => void;
}

export type WebUniversityType = {
    name: string;
    code: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    countryId: number;
    internationalStudentCount: number;
    livingCost: number;
    currency: string;
    localRanking: number;
    worldRanking: number;
    overview: string;
    universityWebsite: string;
    url: string;
    isPublish: boolean;
}

export type WebUniversityDataType = {
    id: number;
    name: string;
    code: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    countryId: number;
    internationalStudentCount: number;
    livingCost: number;
    currency: string;
    localRanking: number;
    worldRanking: number;
    overview: string;
    universityWebsite: string;
    countryInfo: WebCountryDataType;
    url: string;
    coverImage: string; // image
    coverImageId: string;
    logo: string; // image
    logoId: string;
    images: string[]; // only 3 images array
    imageIds: string[];
    isPublish: boolean;
}

export type WebUniversityResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalUniversities: number;
    universities: WebUniversityDataType[];
}

export type WebUniversityResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalUniversities: number;
        universities: WebUniversityDataType[];
    }
}

export type CreateWebUniversityResponseType = {
    success: boolean;
    message: string;
    data: WebUniversityType;
}

export type CreateWebUniversityResponseDataType = {
    success: boolean;
    message: string;
    data: {
        university: WebUniversityType;
    }
}

export type PublishWebUniversityResponseDataType = {
    success: boolean;
    message: string;
    data: WebUniversityType
}
