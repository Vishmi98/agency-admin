import * as Yup from 'yup';
import { parseISO, isAfter, isToday } from 'date-fns';

import { PackageType } from './package.types';


export const addPackageInitialValues: PackageType = {
    title: '',
    countryId: '',
    uniId: '',
    courseName: '',
    cost: "",
    price: "",
    startDate: '',
    qualification: '',
    duration: "",
    nextIntake: '',
    entryQualification: [],
    studyType: '',
    language: '',
    createdBy: '',
    priceInLkr: '',
    costInLkr: ''
};

export const addPackageValidationSchema = Yup.object().shape({
    title: Yup.string()
        .required('Title is required')
        .max(100, 'Title cannot be longer than 100 characters'),

    countryId: Yup.number()
        .required('Country is required'),

    uniId: Yup.number()
        .required('University is required'),

    courseName: Yup.string()
        .required('Course Name is required')
        .max(100, 'Course Name cannot be longer than 100 characters'),

    cost: Yup.number()
        .typeError('Cost must be a number')
        .required('Cost is required')
        .min(0, 'Cost must be a positive number'),

    price: Yup.number()
        .typeError('Price must be a number')
        .required('Price is required')
        .min(0, 'Price must be a positive number'),

    priceInLkr: Yup.number()
        .typeError('Price in LKR must be a valid number')
        .required('Price in LKR is required')
        .min(0, 'Price in LKR must be a positive number')
        .test(
            'max-two-decimals',
            'Price in LKR must have at most 2 decimal places',
            (value) => value !== undefined && /^\d+(\.\d{1,2})?$/.test(value.toString())
        ),

    costInLkr: Yup.number()
        .typeError('Cost in LKR must be a valid number')
        .required('Cost in LKR is required')
        .min(0, 'Cost in LKR must be a positive number')
        .test(
            'max-two-decimals',
            'Cost in LKR must have at most 2 decimal places',
            (value) => value !== undefined && /^\d+(\.\d{1,2})?$/.test(value.toString())
        ),

    startDate: Yup.string()
        .required('Start Date is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
        .test('is-today-or-future', 'Start Date must be today or a future date', (value) => {
            if (!value) return false;
            const startDate = parseISO(value);
            return isToday(startDate) || isAfter(startDate, new Date());
        }),

    qualification: Yup.number()
        .required('Qualification is required'),

    duration: Yup.number()
        .required('Duration is required'),

    nextIntake: Yup.string()
        .required('Next Intake date is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
        .test('is-after-startDate', 'Next Intake must be after Start Date', function (value) {
            const startDate = parseISO(this.parent.startDate);
            const nextIntake = parseISO(value);
            return isAfter(nextIntake, startDate);
        }),

    studyType: Yup.number()
        .required('Study type is required'),

    language: Yup.number()
        .required('Language is required'),
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