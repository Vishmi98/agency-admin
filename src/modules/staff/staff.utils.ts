import * as Yup from 'yup';

import { StaffType } from './staff.types';


export const addStaffInitialValues: StaffType = {
    id: 0,
    title: "",
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    roll: 0,
    nic: "",
    gender: "",
    fullName: "",
    address: "",
    branchId: "",
    basicSalary: 0,
    commissionAmount: 0
};

export const addStaffValidationSchema = Yup.object().shape({
    title: Yup.number().required("Title is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    roll: Yup.number()
        .moreThan(0, "Role is required")
        .required("Role is required"),
    nic: Yup.string()
        .matches(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/, "Invalid NIC format")
        .required("NIC is required"),
    gender: Yup.number().required("Gender is required"),
    fullName: Yup.string().required("Full name is required"),
    address: Yup.string().required("Address is required"),
    branchId: Yup.number()
        .moreThan(0, "Branch is required")
        .required("Branch is required"),
});
