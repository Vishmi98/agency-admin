import * as Yup from 'yup';

import { ExpenseType } from './expenses.types';


export const addExpenseInitialValues: ExpenseType = {
    id: 0,
    expenseType: 0,
    amount: 0,
    smallDescription: '',
    documentPath: '',
    documentId: 0,
    createdBy: 0,
    date: '',
    branchId: 0
}

export const addExpenseValidationSchema = Yup.object({
    expenseType: Yup.number()
        .required('Expense type is required'),
    amount: Yup.number()
        .required('Amount is required')
        .min(0, 'Amount must be greater than 0'),
    smallDescription: Yup.string()
        .required('Small description is required')
        .min(3, 'Description must be at least 3 characters')
        .max(50, 'Description must be at most 50 characters'),
    date: Yup.string()
        .required('Date is required'),
    branchId: Yup.number()
        .required('Expense type is required'),
})