import * as Yup from 'yup';

import { SearchAttendanceFormValues } from './attendance.types';


export const getTodayDate = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

export const searchAttendanceInitialValues: SearchAttendanceFormValues = {
    date: getTodayDate(),
};

export const searchAttendanceValidationSchema = Yup.object({
    date: Yup.string().required('Date is required'),
});