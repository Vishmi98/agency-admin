import { StaffDataType } from "../staff/staff.types";

export type LogDataType = {
    _id: string;
    userId: number;
    action: string;
    endpoint?: string;
    method?: string;
    meta?: any;
    path: string;
    userInfo: StaffDataType;
}

export type LogsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalLogs: number;
    logs: LogDataType[];
}

export type LogsResponseType = {
    success: boolean;
    message: string;
    data: string;
}