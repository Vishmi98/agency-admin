import { LeaveResponseType, LeaveType } from "../leave.types";

import { LEAVE_DATA } from "@/constants/data";


let LEAVES: LeaveType[] = [...LEAVE_DATA];

export const getLeaveData = (): LeaveResponseType => {
    return {
        success: true,
        message: 'Success',
        data: LEAVES
    };
};

export const createLeave = (leave: LeaveType): LeaveResponseType => {
    const newLeave = {
        ...leave,
        id: LEAVES.length > 0 ? LEAVES[LEAVES.length - 1].id + 1 : 1,
    };

    LEAVES.push(newLeave);

    return {
        success: true,
        message: 'Leave created successfully',
        data: LEAVES,
    };
};