import * as Yup from 'yup';

import { AddLeaveType, AttendanceMarkType, SearchAttendanceMarkType } from './attendanceMarks.types';


const getTodayDate = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

export const addAttendanceMarkInitialValues: AttendanceMarkType = {
    id: 0,
    staffId: '',
    inTime: '',
    outTime: '',
    leave: '',
    date: getTodayDate()
};

export const searchAttendanceMarkInitialValues: SearchAttendanceMarkType = {
    date: getTodayDate()
};

export const addLeaveValidationSchema = Yup.object().shape({
    staffId: Yup.number().required('Staff ID is required'),
    leave: Yup.number().nullable().required('Leave type is required')
});

export const searchAttendanceValidationSchema = Yup.object().shape({
    date: Yup.date()
        .max(new Date(), "The date cannot be in the future.")
        .required("Date is required."),
});

export const addAttendanceValidationSchema = Yup.object().shape({
    staffId: Yup.number().required('Staff ID is required'),
    inTime: Yup.string()
        .matches(
            /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/, // Regex for 24-hour time format
            "Invalid time format. Use hh:mm"
        )
        .required("In Time is required")
});

export const addOutTimeValidationSchema = Yup.object().shape({
    outTime: Yup.string()
        .required('Out time is required')
        .matches(
            /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/, // Regex for 24-hour time format
            "Invalid time format. Use hh:mm"
        )
        .test('is-later', 'Out time must be after in time', function (value) {
            const { inTime } = this.parent;
            if (inTime && value) {
                const [inHour, inMinute] = inTime.split(':').map(Number);
                const [outHour, outMinute] = value.split(':').map(Number);

                // Convert hours and minutes to minutes for comparison
                const inTotalMinutes = inHour * 60 + inMinute;
                const outTotalMinutes = outHour * 60 + outMinute;

                return outTotalMinutes > inTotalMinutes;
            }
            return true; // If inTime or outTime is not set, skip the validation.
        })
        .nullable()
});

export const addInTimeValidationSchema = Yup.object().shape({
    inTime: Yup.string()
        .required('In time is required')
        .matches(
            /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/, // Regex for 24-hour time format
            "Invalid time format. Use hh:mm"
        )
        .nullable()
});

export const addLeaveInitialValues: AddLeaveType = {
    id: 0,
    staffId: '',
    inTime: '',
    outTime: '',
    leave: '',
    date: ''
};
