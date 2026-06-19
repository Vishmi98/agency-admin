import * as Yup from 'yup';
import { LeadType } from './leads.types';



export const addLeadInitialValues: LeadType = {
    studentId: '',
    courseId: '',
    staffId: '',
    status: 1,
    note: ''
};

export const addLeadValidationSchema = Yup.object().shape({
    courseId: Yup.number()
        .required('Course is required'),

    studentId: Yup.number()
        .required('Student is required'),

    staffId: Yup.number()
        .required('Staff is required'),

    note: Yup.string()
        .trim()
        .max(200, 'Note cannot exceed 200 characters')
        .optional(),
});


export const updatePackageValidationSchema = Yup.object().shape({
    costInLkr: Yup.number()
        .typeError("Cost must be a number")
        .min(0, "Cost cannot be negative")
        .required("Cost is required"),
    priceInLkr: Yup.number()
        .typeError("Price must be a number")
        .min(0, "Price cannot be negative")
        .required("Price is required"),
});