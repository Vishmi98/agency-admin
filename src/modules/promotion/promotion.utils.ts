import * as Yup from 'yup';

import { PromotionType } from './promotion.types';


export const addPromotionInitialValues: PromotionType = {
    id: 0,
    title: '',
    description: '',
    amount: 0,
};

export const addPromotionValidationSchema = Yup.object({
    title: Yup.string()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters long')
        .max(100, 'Title cannot exceed 100 characters'),

    description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters long')
        .max(500, 'Description cannot exceed 500 characters'),

    amount: Yup.number()
        .required('Amount is required')
        .min(1, 'Amount must be greater than 0')
        .max(10000, 'Amount must be less than or equal to 10000')
        .positive('Amount must be a positive number')
});
