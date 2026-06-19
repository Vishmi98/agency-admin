export type UserType = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    type: number;
};

export type UsersResponseType = {
    success: boolean;
    message: string;
    data: UserType[];
}

export type UserFormValues = {
    handleClose: () => void;
    open: boolean;
    onUserAdded?: () => void;
}
