import * as Yup from 'yup';

import { UniversityPaymentType, UniversitySearchValue, UniversityType, WebUniversityType } from './university.types';


export const universitySearchInitialValues: UniversitySearchValue = {
    universityName: ''
}
export const universitySearchValidationSchema = Yup.object({
    universityName: Yup.string(),
});


export const addUniversityInitialValues: UniversityType = {
    id: 0,
    name: '',
    address: '',
    countryId: '',
    phoneNumber: '',
    email: '',
    staffId: '',
    rank: '',
    code: '',
    isPublish: true
};

export const addUniversityValidationSchema = Yup.object({
    name: Yup.string()
        .required('University name is required')
        .min(3, 'University name must be at least 3 characters long')
        .max(50, 'University name cannot exceed 50 characters'),

    address: Yup.string()
        .required('Address is required')
        .min(3, 'Address must be at least 3 characters long')
        .max(500, 'Address cannot exceed 500 characters'),

    countryId: Yup.number().required('Country is required'),

    phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(
            /^(\+\d{1,3}[- ]?)?\d{10,15}$/,
            'Invalid phone number format'
        ),

    rank: Yup.number()
        .required('Rank is required')
        .typeError('Rank must be a valid number')
        .positive('Rank must be a positive number')
        .integer('Rank must be an integer'),

    code: Yup.number()
        .required('Code is required')
        .typeError('Code must be a valid number')
        .positive('Code must be a positive number')
        .integer('Code must be an integer'),


    email: Yup.string()
        .email('Invalid email address'),
});


export const addUniversityPaymentInitialValues: UniversityPaymentType = {
    id: 0,
    invoiceId: '',
    paymentType: '',
    documentPath: '',
    documentId: 0,
    createdBy: '',
    date: ''
};

export const addUniversityPaymentValidationSchema = Yup.object({
    invoiceId: Yup.number()
        .required('Invoice ID is required'),

    paymentType: Yup.number()
        .required('Payment Type is required'),

    date: Yup.string()
        .required('Date is required')
});

export const addWebUniversityInitialValues: WebUniversityType = {
    name: '',
    code: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    countryId: 0,
    internationalStudentCount: 0,
    livingCost: 0,
    currency: '',
    localRanking: 0,
    worldRanking: 0,
    overview: '',
    universityWebsite: '',
    url: '',
    isPublish: true
};

export const addWebUniversityValidationSchema = Yup.object().shape({
    name: Yup.string().required('University name is required'),

    phone: Yup.string(),

    email: Yup.string().email('Invalid email format'),

    address: Yup.string(),
    city: Yup.string(),

    countryId: Yup.number()
        .required('Country is required')
        .positive('Country ID must be positive')
        .integer(),

    internationalStudentCount: Yup.number(),

    livingCost: Yup.number()
        .min(0, 'Living cost must be a positive number'),

    currency: Yup.string(),
    localRanking: Yup.number(),
    worldRanking: Yup.number(),

    overview: Yup.string(),
    universityWebsite: Yup.string(),

    url: Yup.string(),
});
