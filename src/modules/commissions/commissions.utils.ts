import * as Yup from 'yup';

import { CommissionType } from './commissions.types';


export const addCommissionInitialValues: CommissionType = {
    role: 0,
    amount: 0
}

export const addCommissionValidationSchema = Yup.object({
    role: Yup.number().required('Role is required'),
    amount: Yup.number().nullable().required('Amount is required')
})