export type InquiryDataType = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;

    source?: string; // which client/system sent it
    apiKey?: string; // optional tracking

    status: number;
}

export type InquiriesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalInquiries: number;
    inquiries: InquiryDataType[];
}

export type InquiriesResponseType = {
    success: boolean;
    message: string;
    data: string;
}

export type InquiryPageStateType = {
    inquiries: InquiryDataType[];
    isLoading: boolean;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
    isOpen: boolean;
};

export const inquiryPageInitialState: InquiryPageStateType = {
    inquiries: [],
    isLoading: true,
    page: 0,
    limit: 5,
    totalRows: 0,
    search: "",
    isOpen: false
};

export const inquiryPageReducer = (
    state: InquiryPageStateType,
    action: { type: string; payload?: Partial<InquiryPageStateType> }
) => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'reset':
            return inquiryPageInitialState;
        default:
            throw new Error('Invalid action type');
    }
};

export type InquiriesTableProps = {
    totalRows: number,
    inquiries: InquiryDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    reloadData: () => void
}