export type CallCenterCallDataType = {
    id: number;
    name: string;
    phone: string;
    from: string;
    note: string;
    qualification: string;
    successPercentage: number;
    response: string;
    createBy: number;
    checkBy: number;
    creatorInfo: {
        id: number,
        firstName: string,
        lastName: string
    },
    checkerInfo: {
        id: number,
        firstName: string,
        lastName: string
    }
}

export type CallCenterCallType = {
    id: number;
    name: string;
    phone: string;
    from: string;
    note: string;
    qualification: string;
    successPercentage: number;
    response: string;
    createBy: number | string;
    checkBy: number | string;
}

export type CallsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalCalls: number;
    calls: CallCenterCallDataType[];
}

export type CallsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalCalls: number;
        calls: CallCenterCallDataType[];
    }
}

export type CreateCallResponseType = {
    success: boolean;
    message: string;
    data: CallCenterCallType;
}

export type CreateCallResponseDataType = {
    success: boolean;
    message: string;
    data: {
        newCall: CallCenterCallType;
    }
}

export type UpdateCallResponseType = {
    success: boolean;
    message: string;
    data: CallCenterCallType;
}

export type UpdateCallResponseDataType = {
    success: boolean;
    message: string;
    data: {
        updatedCall: CallCenterCallType;
    }
}