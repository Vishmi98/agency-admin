import * as Yup from 'yup';

import { LeaveType } from './leave.types';


export const addLeaveInitialValues: LeaveType = {
    id: 0,
    type: 0,
    title: '',
    description: '',
};

export const addLeaveValidationSchema = Yup.object({
    type: Yup.number().required('Leave type is required'),
    title: Yup.string()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters long')
        .max(100, 'Title cannot exceed 100 characters'),
    description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters long')
        .max(500, 'Description cannot exceed 500 characters'),
});