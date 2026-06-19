/* eslint-disable no-unused-vars */
import { DropdownType } from "@/type/common.types";
import { AttendanceRecordType, InTimeType } from "../test/test.types";
import { StaffDataType } from "../staff/staff.types";

export type AttendanceMarkType = {
    id: number;
    staffId: number | string;
    date?: string;
    inTime: string;
    outTime?: string;
    leave?: number | string;
    shiftStartTime?: string;
    shiftEndTime?: string;
}

export type SearchAttendanceMarkType = {
    date?: string;
}

export type AttendanceDataType = {
    id: number;
    staffId: number | string;
    date: string;
    inTime: string;
    outTime: string;
    shiftStartTime?: string;
    shiftEndTime?: string;
    leave: number;
    createdBy: number;
    staffInfo: {
        id: number;
        firstName: string;
        lastName: string;
    },
    leaveInfo: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    } | null;
}

export type AttendanceDataType_ = {
    id: number;
    staffId: number;
    date: string;
    inTime: string;
    outTime: string;
    leave?: number | string;
    createdBy?: number | string;
    staffInfo?: {
        id: number;
        firstName: string;
        lastName: string;
    },
    leaveInfo?: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    } | null;
}

export type TodayAttendanceResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalAttendance: number;
    attendance: AttendanceDataType_[];
}

export type TodayAttendanceResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalAttendance: number;
        attendance: AttendanceDataType_[];
    }
}

export type AttendanceResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalAttendance: number;
    attendance: AttendanceDataType[];
}

export type AttendanceResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalAttendance: number;
        attendance: AttendanceDataType[];
    }
}

export type LeaveTypesResponseType = {
    success: boolean;
    message: string;
    data: { leaveTypes: DropdownType[] | [] };
}

export type LeaveTypesResponseDataType = {
    success: boolean;
    message: string;
    leaveTypes: DropdownType[] | []
}

export type CreateLeaveResponseType = {
    success: boolean;
    message: string;
    data: AttendanceMarkType;
}

export type CreateLeaveResponseDataType = {
    success: boolean;
    message: string;
    data: {
        Attendance: AttendanceMarkType;
    }
}

export type StaffWithoutAttendanceType = {
    id: number;
    fullName: string;
    firstName: string;
    lastName: string;
}

export type StaffWithoutAttendanceResponseDataType = {
    success: boolean;
    message: string;
    staff: StaffWithoutAttendanceType[];
}

export type StaffWithoutAttendanceResponseType = {
    success: boolean;
    message: string;
    data: {
        staff: StaffWithoutAttendanceType[];
    }
}

export type AttendanceFormValues = {
    handleReload: () => void;
    reload: boolean;
    staffMembers: StaffWithoutAttendanceType[]
}

export type AddLeaveFormValues = {
    handleReload: () => void;
    reload: boolean;
    staffMembers: StaffDataType[]
}

export type SearchAttendanceFormValues = {
    handleReload: () => void;
    handleUpdateDate: (date: string) => void
}

export type AddInTimeResponseType = {
    success: boolean;
    message: string;
    data: InTimeType;
}

export type AddInTimeResponseDataType = {
    success: boolean;
    message: string;
    data: {
        test: InTimeType;
    }
}

export type AddOutTimeResponseType = {
    success: boolean;
    message: string;
    data: OutTimeType;
}

export type AddOutTimeResponseDataType = {
    success: boolean;
    message: string;
    data: {
        test: OutTimeType;
    }
}

export type AddOutTimeFormValues = {
    handleClose: () => void;
    open: boolean;
    handleReload: () => void;
    selectedRow: AttendanceRecordType;
}

export type AddLeaveModalPropType = {
    handleClose: () => void;
    open: boolean;
    handleReload: () => void;
    staffMembers: StaffWithoutAttendanceType[]
}

export type AttendanceTableProps = {
    reload?: boolean;
    handleReload: () => void;
    todayDate: string
}

export type TableProps = {
    reload?: boolean;
    handleReload: () => void;
}

export type OutTimeType = {
    id: number;
    staffId: number | string;
    outTime: string;
}

export type InTimeType_ = {
    inTime: string;
}

export type OutTimeType_ = {
    outTime: string;
}

export type AbsentStaffsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalLeaves: number;
    leaves: AttendanceDataType_[];
}

export type AbsentStaffsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalLeaves: number;
        leaves: AttendanceDataType_[];
    }
}

export type AddLeaveType = {
    id: number;
    staffId: number | string;
    date: string;
    inTime?: string;
    outTime?: string;
    leave: number | string;
    createdBy?: number | string;
}

export type AddLeaveResponseType = {
    success: boolean;
    message: string;
    data: AddLeaveType;
}

export type AddLeaveResponseDataType = {
    success: boolean;
    message: string;
    data: {
        Attendance: AddLeaveType;
    }
}