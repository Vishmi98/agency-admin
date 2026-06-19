import { DropdownType } from "@/type/common.types";
import { StaffDataType } from "../staff/staff.types";
import { StudentDataType } from "../student/student.types";
import { UniversityDataType } from "../university/university.types";
import { CourseDataType } from "../courses/courses.types";

export type LeadType = {
    studentId: number | string;
    staffId: number | string;
    courseId: number | string;
    status: number | string;
    note: string;
}

export type LeadDataType = {
    id: number;
    studentId: number;
    staffId: number;
    courseId: number;
    status: number;
    note: string;
    studentInfo: StudentDataType;
    staffInfo: StaffDataType;
    courseInfo: CourseDataType;
    statusInfo: {
        id: number;
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        color: string;
    }
}

export type LeadsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalLeads: number;
    leads: LeadDataType[];
}

export type LeadsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalLeads: number;
        leads: LeadDataType[];
    }
}

export type CreateLeadResponseType = {
    success: boolean;
    message: string;
    data: LeadType;
}

export type CreateLeadResponseDataType = {
    success: boolean;
    message: string;
    data: {
        lead: LeadType;
    }
}

export type LeadPageStateType = {
    leads: LeadDataType[];
    isLoading: boolean;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
    isOpen: boolean;
};

export const leadPageInitialState: LeadPageStateType = {
    leads: [],
    isLoading: true,
    page: 0,
    limit: 5,
    totalRows: 0,
    search: "",
    isOpen: false
};

export const leadPageReducer = (
    state: LeadPageStateType,
    action: { type: string; payload?: Partial<LeadPageStateType> }
) => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'reset':
            return leadPageInitialState;
        default:
            throw new Error('Invalid action type');
    }
};

export type LeadsTableProps = {
    totalRows: number,
    leads: LeadDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    reloadData: () => void
}

export type UpdateLeadResponseDataType = {
    success: boolean;
    message: string;
    data: {
        lead: LeadType;
    }
}

export type UpdateLeadResponseType = {
    success: boolean;
    message: string;
    data: LeadType;
}

export type LeadStatusDataType = {
    id: number;
    title: {
        EN: string,
        SN: string,
        TM: string
    };
    color: string;
}

export type LeadStatusesResponseDataType = {
    success: boolean;
    message: string;
    leadStatuses: LeadStatusDataType[];
}

export type LeadStatusesResponseType = {
    success: boolean;
    message: string;
    data: {
        leadStatuses: LeadStatusDataType[];
    }
}