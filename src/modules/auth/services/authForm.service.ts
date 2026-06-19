import { LoginFormType, LoginResponseType, UserLoginResponseType } from "../authForm.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const handleUserLogin = async ({ email, password }: LoginFormType): Promise<UserLoginResponseType> => {
    const response: LoginResponseType = await apiCall({
        url: `${URL}/auth/login-staff`,
        method: 'POST',
        body: { email, password },
        isAuth: false
    })

    if (response?.success) {
        return {
            success: true,
            message: response?.message,
            token: response?.data?.token
        }
    }
    else {
        return {
            success: false,
            message: response?.message,
        }
    }
};