import * as Yup from 'yup';

import { BasicSalaryType, SalaryAdvanceType, SearchSalariesFormValues } from './salaryAdvance.types';


const getTodayDate = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

export const getPreviousMonth = (): string => {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${mm}`;
};

export const addSalaryAdvanceInitialValues: SalaryAdvanceType = {
    staffId: '',
    amount: 0,
    date: getTodayDate(),
    approvalBy: 0,
    isSettle: false,
    isPaid: false,
};

export const addSalaryAdvanceValidationSchema = Yup.object().shape({
    staffId: Yup.number().required('Staff ID is required'),
    amount: Yup.number().nullable().required('Amount is required')
});


export const addBasicSalaryInitialValues: BasicSalaryType = {
    role: '',
    title: '',
    basicSalary: ''
}

export const addBasicSalaryValidationSchema = Yup.object({
    role: Yup.number().required('Role is required'),
    title: Yup.string().required('Title is required'),
    basicSalary: Yup.number().nullable().required('Basic Salary is required')
})

export const searchSalariesInitialValues: SearchSalariesFormValues = {
    month: getPreviousMonth(),
};

export const searchSalariesValidationSchema = Yup.object({
    month: Yup.string().required('Month is required'),
});