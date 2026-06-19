import { AttendanceMarkType } from "../attendanceMark/attendanceMarks.types";

export type AddOutTimeFormValues = {
    handleClose: () => void;
    open: boolean;
    handleReload: () => void;
    selectedRow: AttendanceMarkType;
}