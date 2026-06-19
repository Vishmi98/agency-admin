import * as Yup from 'yup';

import { InvoiceType } from './invoice.types';


export const addInvoiceInitialValues: InvoiceType = {
    id: 0,
    packageId: '',
    invoiceDate: '',
    totalPrice: 0,
    studentId: '',
    staffId: '',
    extraPayment: [],
    selectedExtraPayment: '',
    exchangeRate: 0,
    currency: "LKR",
    branchId: '',
    discount: [],
    selectedDiscount: '',
    updatePackageId: ''
}

export const addInvoiceValidationSchema = Yup.object({
    packageId: Yup.string()
        .required('Package is required'),

    invoiceDate: Yup
        .string().required('Date is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
        .test('is-past-date', 'Invoice date cannot be in the future', (value) => {
            if (!value) return false;
            return new Date(value) <= new Date();
        }),

    extraPayment: Yup.array()
        .of(Yup.number().min(0, 'Extra payment must be a positive value'))
        .default([]), // Default to an empty array if no extra payments are added

    discount: Yup.array()
        .of(Yup.number().min(0, 'Discount must be a positive value'))
        .default([]), // Default to an empty array if no discounts are added

    totalPrice: Yup.number()
        .typeError('Total price must be a number')
        .required('Total price is required')
        .min(0, 'Total price must be a positive number'),

    studentId: Yup.string()
        .required('Student is required'),

    branchId: Yup.string()
        .required('Branch is required'),

    staffId: Yup.string()
        .required('Staff is required'),
});
