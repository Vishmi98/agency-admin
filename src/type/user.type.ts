import { Method } from "axios";

export type ApiCallOptions = {
    url: string;
    method?: Method; // GET, POST, PUT, etc.
    body?: Record<string, any>;
    params?: Record<string, any>;
    isAuth?: boolean;
}

export interface AuthUser {
    user: {
        id: number,
        firstName: string,
        lastName: string,
        roll: number,
        email: string

    }
}