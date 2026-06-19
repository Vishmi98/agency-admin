
export type CurrentWeekInvoices = {
    name: string;
    data: number[];
}

export type ThisWeekInvoicesResponseType = {
    success: boolean;
    message: string;
    data: {
        currentWeekInvoices: CurrentWeekInvoices[];
    }
}

export type ThisWeekInvoicesType = {
    success: boolean;
    message: string;
    chartData: CurrentWeekInvoices[];
}


export type TopSale= {
    "invoiceCount": number,
    "staffId": number,
    "firstName": string,
    "lastName": string
}

export type TopSaleResponseType = {
    success: boolean;
    message: string;
    data: {
        topStaffsCurrentMonth: TopSale[];
    }
}

export type TopSaleType = {
    success: boolean;
    message: string;
    topSale: TopSale[];
}
