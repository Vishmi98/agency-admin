import * as Yup from 'yup';

import { SearchShiftFormValues } from './attendance.types';


export const searchShiftInitialValues = {
    date: '',
    staffId: 0,
};

export const searchShiftValidationSchema = Yup.object({
    date: Yup.string().required('Date is required'),
    staffId: Yup.number().min(1, 'Please select a staff').required('Staff is required'),
});
