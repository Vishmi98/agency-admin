import * as Yup from 'yup';

import { CallCenterCallType } from './callCenter.types';


export const addCallInitialValues: CallCenterCallType = {
    id: 0,
    name: "",
    phone: "",
    from: "",
    note: "",
    qualification: "",
    successPercentage: 0,
    response: "",
    createBy: "",
    checkBy: "",
};

export const addCallCenterCallValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string()
        .matches(/^(07[0-9]{8})$/, "Enter a valid Sri Lankan mobile number")
        .required("Phone is required"),
    from: Yup.string().required("Source (from) is required"),
    note: Yup.string(),
    qualification: Yup.string().required("Qualification is required"),
    successPercentage: Yup.number()
        .min(0, "Must be at least 0")
        .max(100, "Cannot exceed 100")
        .required("Success percentage is required"),
    response: Yup.string(),
    createBy: Yup.number().min(0),
});