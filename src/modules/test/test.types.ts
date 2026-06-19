/* eslint-disable no-unused-vars */
export type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];

export type DailyAttendanceProps = {
    selectedDate: Date;
}

export type CalendarPageProps = {
    onDateChange: (date: Date) => void;
}

export type AttendanceRecordType = {
    staffId: number | string;
    name: string;
    startTime: string;
    endTime: string;
    shiftId: string;
    attendanceId: number;
    shiftInfo: {
        id: number,
        name: string,
        startTime: string;
        endTime: string;
    }
}

export type InTimeType = {
    staffId: number | string;
    inTime: string;
    date: string;
}

export type TodayAttendanceType = {
    id: number;
    date: string;
    attendance: {
        id: number;
        staffId: number;
        startTime: string;
        endTime: string;
        shiftId: number;
        leaveId?: number | string;
        staffInfo: {
            id: number,
            fullName: string;
        },
        shiftInfo: {
            id: number,
            shiftName: string,
            startTime: string;
            endTime: string;
        },
        leaveInfo?: {
            title: {
                SN: string;
                EN: string;
                TM: string;
            };
            id: number;
        }
    }[]
}

export type TodayAttendanceResponseType = {
    success: boolean;
    message: string;
    data: AttendanceRecordType[];
};

export type TodayAttendanceResponseDataType = {
    success: boolean;
    message: string;
    data: AttendanceRecordType[];
};

export type MyAttendanceResponseDataType = {
    success: boolean;
    message: string;
    data: AttendanceRecordType;
};