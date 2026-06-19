export type LeaveType = {
    id: number;
    type: number;
    title: string;
    description: string;
}

export type LeaveResponseType = {
    success: boolean;
    message: string;
    data: LeaveType[];
}

export type LeaveFormValues = {
    handleClose: () => void;
    open: boolean;
    onLeaveAdded?: () => void;
}
