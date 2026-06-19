import * as Yup from 'yup';

import { ExtraPaymentType } from './extraPayment.types';


export const addExtraPaymentInitialValues: ExtraPaymentType = {
    id: 0,
    title: '',
    amount: "",
    currency: 'LKR'
};

export const addExtraPaymentValidationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    amount: Yup.number()
        .positive('Amount must be a positive number')
        .required('Amount is required'),

    currency: Yup.string()
        .matches(/^[A-Z]{3}$/, 'Currency must be a valid 3-letter code (e.g., USD, EUR, LKR)')
        .required('Currency is required')
});
