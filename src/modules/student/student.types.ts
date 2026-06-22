/* eslint-disable no-unused-vars */
import { DropdownType } from "@/type/common.types";


export type StudentType = {
    id: number;
    title: number | string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string;
    email: string;
    nic: string;
    address: string;
    passportNo: string;
    issueDate: string;
    expireDate: string;
    visaIssueDate: string;
    visaExpireDate: string;
    password?: string;
    createdBy: number | string;
    visaStatus: number | string;
    branchId?: number | string;
    isAgree: boolean;
};

export type StudentDataType = {
    id: number;
    title: number;
    firstName: string;
    lastName: string;
    fullName: string;
    passportNo: string;
    issueDate: string;
    expireDate: string;
    phone: string;
    visaIssueDate: string;
    visaExpireDate: string;
    email: string;
    address: string;
    nic: string;
    createdBy: number;
    visaStatus: number;
    status: number;
    branchId: number;
    titleInfo: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
    statusInfo: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
    visaStatusInfo: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
    branchInfo: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
    isAgree: boolean;
};

export type StudentsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalStudents: number;
    students: StudentDataType[];
}

export type StudentsResponseType = {
    success: boolean;
    message: string;
    data: string;
}

export type StudentStatusResponseType = {
    success: boolean;
    message: string;
    data: { studentStatus: DropdownType[] | [] };
}

export type StudentStatusResponseDataType = {
    success: boolean;
    message: string;
    studentStatus: DropdownType[] | []
}

export type EditStudentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reloadData: () => void;
    initialValues: StudentType | null;
}

export type CreateStudentResponseDataType = {
    success: boolean;
    message: string;
    data: {
        student: StudentType;
    }
}

export type CreateStudentResponseType = {
    success: boolean;
    message: string;
    data: string;
}

export type UpdateStudentResponseDataType = {
    success: boolean;
    message: string;
    data: {
        student: StudentType;
    }
}

export type UpdateStudentResponseType = {
    success: boolean;
    message: string;
    data: string;
}

export type StudentSearchProps = {
    onSearch: () => void;
    setSearch: (i: string) => void,
    search: string,
    loading: boolean,
    handleClearSearch: () => void
}

export type StudentTableProps = {
    totalRows: number,
    students: StudentDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    selectedStudent: StudentDataType | null,
    setSelectedStudent: (i: StudentDataType) => void,
    reloadData: () => void
}

export type StudentPageStateType = {
    students: StudentDataType[];
    isLoading: boolean;
    selectedStudent: StudentDataType | null;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
}

export const studentPageInitialState: StudentPageStateType = {
    students: [],
    isLoading: true,
    selectedStudent: null,
    page: 0,
    limit: 5,
    totalRows: 0,
    search: "",
};

export const studentPageReducer = (state: StudentPageStateType, action: { type: string; payload?: Partial<StudentPageStateType> }) => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'reset':
            return studentPageInitialState;
        default:
            throw new Error('Invalid action type');
    }
};

export type VisaStatusResponseType = {
    success: boolean;
    message: string;
    data: string;
}

export type VisaStatusResponseDataType = {
    success: boolean;
    message: string;
    visaStatusTypes: DropdownType[] | []
}

export type StudentProp = {
    student: StudentDataType,
    setIsModalOpen: (open: boolean) => void
}