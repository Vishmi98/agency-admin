import * as Yup from 'yup';

import { MainCommissionType, SubCommissionType } from './commission.types';


const today = new Date().toISOString().split("T")[0];

export const addMainCommissionInitialValues: MainCommissionType = {
    date: today,
    invoiceId: "",
    studentId: "",
    packageId: "",
    uniId: "",
    branchId: "",
    staffId: "",
    amount: 0,
    percentage: 0,
    dueAmount: 0,
    paidAmount: 0,
    introduceAmount: 0,
    monthlyAmount: 0,
    status: "pending",
    introduceAmountPaid: false,
};

export const addMainCommissionValidationSchema = Yup.object().shape({
    date: Yup.string().required("Date is required"),
    invoiceId: Yup.mixed().required("Invoice ID is required"),
    amount: Yup.number()
        .required("Amount is required")
        .min(0, "Amount cannot be negative"),
    percentage: Yup.number()
        .required("Percentage is required")
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot exceed 100"),
});

export const addSubCommissionInitialValues: SubCommissionType = {
    commissionId: "",
    month: "",
    staffId: "",
    amount: 0,
    paidDateAndTime: null,
    status: "available",
    isAutoCreated: false
};

export const addSubCommissionValidationSchema = Yup.object().shape({
    commissionId: Yup.number()
        .typeError("Commission is required")
        .required("Commission is required"),
    month: Yup.string()
        .required("Month is required"),
    paidDateAndTime: Yup.date()
        .nullable()
        .typeError("Invalid date"),
});
