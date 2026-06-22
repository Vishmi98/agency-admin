import * as Yup from 'yup';
import "yup-phone";
import { parse, isValid, isAfter, isBefore, isToday } from 'date-fns';

import { StudentType } from './student.types';


export const addStudentInitialValues: StudentType = {
    id: 0,
    title: '',
    firstName: '',
    lastName: '',
    fullName: '',
    passportNo: '',
    issueDate: '',
    expireDate: '',
    phone: '',
    visaIssueDate: '',
    visaExpireDate: '',
    email: '',
    address: '',
    nic: '',
    createdBy: '',
    visaStatus: '',
    password: '',
    branchId: '',
    isAgree: true,
};

export const addStudentValidationSchema = Yup.object({
    title: Yup.number().required('Title is required'),

    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name cannot exceed 50 characters'),

    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name cannot exceed 50 characters'),

    fullName: Yup.string()
        .required('Full name is required')
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name cannot exceed 100 characters'),

    passportNo: Yup.string()
        .required('Passport number is required'),
    // .matches(/^[A-Z]\d{8}$/, 'Invalid passport number format (e.g., A1234567)'),

    issueDate: Yup.string()
        .required('Issue date is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
        .test('valid-date', 'Invalid date', (value) => isValid(parse(value!, 'yyyy-MM-dd', new Date())))
        .test('past-or-today', 'Issue date cannot be in the future', (value) => {
            const date = parse(value!, 'yyyy-MM-dd', new Date());
            return isBefore(date, new Date()) || isToday(date);
        }),

    expireDate: Yup.string()
        .required('Expiry date is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
        .test('valid-date', 'Invalid date', (value) => isValid(parse(value!, 'yyyy-MM-dd', new Date())))
        .test('after-issue', 'Expiry date must be after the issue date', function (value) {
            const issueDate = this.parent.issueDate;
            if (!issueDate || !value) return true;
            return isAfter(parse(value, 'yyyy-MM-dd', new Date()), parse(issueDate, 'yyyy-MM-dd', new Date()));
        }),

    phone: Yup.string()
        .required('Phone number is required')
        .matches(
            /^(\+\d{1,3}[- ]?)?\d{10,15}$/,
            'Invalid phone number format'
        ),

    visaIssueDate: Yup.string(),

    visaExpireDate: Yup.string(),

    email: Yup.string()
        .transform(value => value?.toLowerCase())
        .required('Email is required')
        .email('Invalid email format'),

    address: Yup.string().required('Address is required'),

    nic: Yup.string()
        .required('NIC is required'),
    // .matches(/^([0-9]{9}[VvXx]|[0-9]{12})$/, 'Invalid NIC format (e.g., 123456789V or 200012345678)'),

    visaStatus: Yup.number().required('Visa status is required'),

    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*?&)'),
    branchId: Yup.number(),
    createdBy: Yup.number(),
    isAgree: Yup.boolean()
        .oneOf([true], "You must accept terms & conditions"),
});