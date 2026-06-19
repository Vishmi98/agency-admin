import * as Yup from 'yup';

import { LoginFormType } from "./authForm.types";


export const loginFormInitialValues: LoginFormType = {
    email: '',
    password: ''
};

export const loginFormValidationSchema = () => Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
});