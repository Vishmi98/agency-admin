export type LoginFormType = {
    email: string;
    password: string;
}

export type UserLoginResponseType = {
    success: boolean;
    message?: string;
    token?: string
}

export type LoginResponseType = {
    success: boolean;
    message: string;
    data: string;
}
