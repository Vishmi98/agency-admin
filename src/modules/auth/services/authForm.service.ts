import { LoginFormType, LoginResponseType, UserLoginResponseType } from "../authForm.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";
import { encryptData } from "@/lib/encrypt";
import { decryptData } from "@/lib/decrypt";


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
        const decryptedData = decryptData(response.data);

        return {
            success: true,
            message: response.message,
            token: decryptedData.token,
        };
    }

    return {
        success: false,
        message: response?.message,
    };
};