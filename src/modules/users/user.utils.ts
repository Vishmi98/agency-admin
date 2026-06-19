import * as Yup from 'yup';

import { UserType } from './user.types';


export const addUserInitialValues: UserType = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    type: 0
};

export const addUserValidationSchema = Yup.object({
    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(30, 'First name cannot exceed 50 characters'),

    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(30, 'Last name cannot exceed 50 characters'),

    email: Yup.string()
        .required('Email is required')
        .email('Invalid email format'),

    phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(/^\+?\d{10,15}$/, 'Phone number must be between 10 and 15 digits'),

    type: Yup.number().required('Type is required'),
});
