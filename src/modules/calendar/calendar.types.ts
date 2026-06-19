export type PoyaDayType = {
    id: number;
    date: string;
    isHoliday: boolean;
}

export type MonthType = {
    month: string;
    dates: PoyaDayType[];
}

export type CreatePoyaDaysResponseType = {
    success: boolean;
    message: string;
    month: string;
    dates: string[];
    workDays: number;
}

export type CreatePoyaDaysResponseDataType = {
    success: boolean;
    message: string;
    data: {
        month: string;
        dates: string[];
        workDays: number;
    }
}

export type PoyaDaysResponseType = {
    success: boolean;
    message: string;
    data: {
        months: MonthType[];
    };
}

export type PoyaDaysResponseDataType = {
    success: boolean;
    message: string;
    data: {
        months: MonthType[];
    };
}