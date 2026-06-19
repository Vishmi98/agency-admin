/* eslint-disable no-unused-vars */
import { PoyaDayType } from "../calendar/calendar.types";
import { StaffDataType } from "../staff/staff.types";


export interface RoasterResponseType {
    success: boolean;
    message: string;
    data: {
        rosters: RoasterDataType[];
        holidays: PoyaDayType[];
    }
}

export interface RoasterResponseDataType {
    success: boolean;
    message: string;
    rosters: RoasterDataType[];
    holidays: PoyaDayType[];
}

export type EditAttendanceSheetProps = {
    year: number;
    month: number;
    setYear: (year: number | null) => void;
    setMonth: (month: number | null) => void;
    roasterId: string;
    refreshMonths: () => void;
}

export type AttendanceSheetProps = {
    year: number;
    month: number;
    setYear: (year: number) => void;
    setMonth: (month: number) => void;
    roasterData: RoasterDataType[];
    holiDays: PoyaDayType[];
}

export type EditRosterProps = {
    year: number;
    month: number;
    setYear: (year: number) => void;
    setMonth: (month: number) => void;
    roasterId: string;
}

export type ShiftType = {
    shiftId: number;
    dates: string[];
    id: string;
};

export type StaffType = {
    staffId: number;
    shifts: ShiftType[];
    id: string;
};

export type StaffInfoType = {
    id: number;
    fullName: string;
};

export type ShiftInfoType = {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
};

export type RoasterDataType = {
    rosterId: string;
    shiftId: number;
    date: string;
    staffId: number;
    staffInfo: StaffInfoType[];
    shiftInfo: ShiftInfoType;
    id: string | null;
};

export type AttendanceType = {
    rosterId: string;
    shiftId: number;
    staffId: number;
    date: string;
};

export type CreateRoasterResponseType = {
    success: boolean;
    message: string;
    data: AttendanceType[];
}

export type CreateRoasterResponseDataType = {
    success: boolean;
    message: string;
    data: {
        rosters: AttendanceType[];
    }
}

export type MonthDataType = {
    month: string;
    dates: PoyaDayType[];
    workDays: number;
}

export type StaffRoasterResponseType = {
    success: boolean;
    message: string;
    monthData: MonthDataType;
    staffData: StaffDataType[];
}

export type StaffRoasterResponseDataType = {
    success: boolean;
    message: string;
    data: {
        monthData: MonthDataType;
        staffData: StaffDataType[];
    }
}

export type CreateRosterRequest = {
    rosters: AttendanceType[];
}

export type AttendanceData = {
    [staffId: number]: {
        [day: number]: "A" | "B" | "Off";
    };
}

export type AttendanceOptionModalProps = {
    open: boolean;
    onClose: () => void;
    onSave: (option: "A" | "B" | "Off") => void;
}

export interface NoRosterMonth {
    _id: string;
    month: string;
    dates: PoyaDayType[];
    workDays: number;
    isRosterCreated: boolean;
}

export interface NoRosterMonthsResponseType {
    success: boolean;
    message: string;
    data: NoRosterMonth[];
}

export interface NoRosterMonthsResponseDataType {
    success: boolean;
    message: string;
    data: NoRosterMonth[];
}

export type SearchMonthFormValues = {
    month: string
}

export type SearchRosterProps = {
    months: NoRosterMonth[];
    onSearch: (month: string) => void;
    refreshMonths: () => void;
};

export type SearchShiftProps = {
    onSearch: (data: any) => void;
};

export type SearchShiftFormValues = {
    rosterId: string;
    date: string;
    staffId: number;
}

export type RosterByIdResponseType = {
    success: boolean;
    message: string;
    rosterId: string;
    shiftId: number;
    date: string;
    staffId: number;
    staffInfo: StaffDataType[];
    shiftInfo: ShiftInfoType[]
}

export type RosterByIdResponseDataType = {
    success: boolean;
    message: string;
    data: {
        rosterId: string;
        shiftId: number;
        date: string;
        staffId: number;
        staffInfo: StaffDataType[];
        shiftInfo: ShiftInfoType[]
    }
}

export type RosterDetailsProps = {
    rosterData: RoasterDataType;
    onUpdated: (updatedData: any) => void;
};