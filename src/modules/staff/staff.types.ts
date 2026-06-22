/* eslint-disable no-unused-vars */
import { DropdownType } from "@/type/common.types";

export type TitlesResponseType = {
    success: boolean;
    message: string;
    data: string;
}

export type TitlesResponseDataType = {
    success: boolean;
    message: string;
    titles: DropdownType[] | []
}

export type GendersResponseType = {
    success: boolean;
    message: string;
    data: string;
}

export type GendersResponseDataType = {
    success: boolean;
    message: string;
    genders: DropdownType[] | []
}

export type BranchesResponseType = {
    success: boolean;
    message: string;
    data: string;
}

export type BranchesResponseDataType = {
    success: boolean;
    message: string;
    branches: DropdownType[] | []
}

export type StaffFormValues = {
    handleClose: () => void;
    open: boolean;
    onMemberAdded?: () => void;
}

export type StaffType = {
    id: number;
    firstName: string;
    lastName: string;
    password?: string;
    email: string;
    roll: number;
    title: number | string;
    nic: string;
    gender: number | string;
    fullName: string;
    address: string;
    branchId?: number | string,
    basicSalary: number;
    commissionAmount: number;
}

export type StaffDataType = {
    id: number;
    firstName: string;
    lastName: string;
    isVerify: boolean;
    email: string;
    isPublish: boolean;
    roll: number;
    title: number;
    nic: string;
    gender: number;
    isEmailVerify: boolean;
    isMobileVerify: boolean;
    eduction: any[];
    experience: any[];
    fullName: string;
    cvPath: string;
    cvPathId: string;
    address: string;
    titleInfo: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
    genderInfo: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
    basicSalary: number;
    commissionAmount: number;
    isAttendanceMatter: boolean;
    isBasicSalaryPay: boolean;
    isActive: boolean;
};

export type StaffResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalStaffs: number;
    staffs: StaffDataType[];
}

export type StaffResponseType = {
    success: boolean;
    message: string;
    data: string;
}

export type StaffSearchProps = {
    onSearch: () => void;
    setSearch: (i: string) => void,
    search: string,
    loading: boolean,
    handleClearSearch: () => void
}

export type GeneratedSalaryStaffPageStateType = {
    staffs: StaffDataType[];
    isLoading: boolean;
    selectedStaff: StaffDataType | null;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
    selectedMonth: string;
}

export type StaffPageStateType = {
    staffs: StaffDataType[];
    isLoading: boolean;
    selectedStaff: StaffDataType | null;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
    isOpen: boolean;
}

export const generatedSalaryStaffPageInitialState: GeneratedSalaryStaffPageStateType = {
    staffs: [],
    isLoading: true,
    selectedStaff: null,
    page: 0,
    limit: 5,
    totalRows: 0,
    search: "",
    selectedMonth: ""
};

export const staffPageInitialState: StaffPageStateType = {
    staffs: [],
    isLoading: true,
    selectedStaff: null,
    page: 0,
    limit: 5,
    totalRows: 0,
    search: "",
    isOpen: false
};

export const staffPageReducer = (state: StaffPageStateType, action: { type: string; payload?: Partial<StaffPageStateType> }) => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'reset':
            return staffPageInitialState;
        default:
            throw new Error('Invalid action type');
    }
};

export const generateSalaryStaffPageReducer = (state: GeneratedSalaryStaffPageStateType, action: { type: string; payload?: Partial<GeneratedSalaryStaffPageStateType> }) => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'reset':
            return generatedSalaryStaffPageInitialState;
        default:
            throw new Error('Invalid action type');
    }
};

export type GenerateSalariesTableProps = {
    totalRows: number,
    staffs: StaffDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    reloadData: () => void
    selectedMonth: string;
}

export type StaffTableProps = {
    totalRows: number,
    staffs: StaffDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    reloadData: () => void
    selectedStaff: StaffDataType | null,
    setSelectedStaff: (i: StaffDataType) => void,
}

export type UpdateAttendanceMatterStatusResponseDataType = {
    success: boolean;
    message: string;
    data: string;
}

export type StaffWithoutSalaryResponseDataType = {
    success: boolean;
    message: string;
    month: number;
    page: number;
    limit: number;
    totalPages: number;
    totalStaffs: number;
    staff: StaffDataType[];
}

export type StaffWithoutSalaryResponseType = {
    success: boolean;
    message: string;
    data: {
        month: number;
        page: number;
        limit: number;
        totalPages: number;
        totalStaffs: number;
        staff: StaffDataType[];
    }
}

export type CreateStaffResponseType = {
    success: boolean;
    message: string;
    data: string;
}

export type CreateStaffResponseDataType = {
    success: boolean;
    message: string;
    data: {
        staff: StaffType;
    }
}

export type EditStaffModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reloadData: () => void;
    initialValues: StaffType | null;
}

export type UpdateStaffResponseDataType = {
    success: boolean;
    message: string;
    data: {
        staff: StaffType;
    }
}

export type UpdateStaffResponseType = {
    success: boolean;
    message: string;
    data: string;
}