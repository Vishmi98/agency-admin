import * as Yup from 'yup';

import { PaymentType } from './payment.types';


export const addPaymentInitialValues: PaymentType = {
    invoiceId: '',
    paymentDate: '',
    amountLkr: '',
    amountUsd: '',
    paymentType: '',
    createdBy: '',
    studentId: 0,
    branchId: ''
};

export const addPaymentValidationSchema = Yup.object({
    invoiceId: Yup.number()
        .required('Invoice ID is required'),

    paymentDate: Yup
        .string().required('Date is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
        .test('is-past-date', 'Date cannot be in the future', (value) => {
            if (!value) return false;
            return new Date(value) <= new Date();
        }),

    amountLkr: Yup.number()
        .required('Amount is required')
        .typeError('Amount must be a number')
        .positive('Amount must be positive'),

    paymentType: Yup.number()
        .required('Payment Type is required'),

    branchId: Yup.string()
        .required('Branch is required'),
});