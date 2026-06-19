import { UsersResponseType, UserType } from "../user.types";

import { USERS_DATA } from "@/constants/data";


let USERS: UserType[] = [...USERS_DATA];

export const getUserData = (): UsersResponseType => {
    return {
        success: true,
        message: 'Success',
        data: USERS
    };
};

export const createUser = (user: UserType): UsersResponseType => {
    const newUser = {
        ...user,
        id: USERS.length > 0 ? USERS[USERS.length - 1].id + 1 : 1,
    };

    USERS.push(newUser);

    return {
        success: true,
        message: 'User created successfully',
        data: USERS,
    };
};