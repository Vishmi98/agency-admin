import { LoginFormType, LoginResponseType, UserLoginResponseType } from "../authForm.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";
import { encryptData } from "@/lib/encrypt";


export const handleUserLogin = async (body: LoginFormType): Promise<UserLoginResponseType> => {
    const encryptedPayload = encryptData(body);

    const response: LoginResponseType = await apiCall({
        url: `${URL}/auth/login-staff`,
        method: 'POST',
        body: {
            payload: encryptedPayload,
        },
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