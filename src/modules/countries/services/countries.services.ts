import { CountriesResponseDataType, CountriesResponseType, CreateCountryResponseDataType, CreateCountryResponseType, CreateWebCountryResponseDataType, CreateWebCountryResponseType, PublishWebCountryResponseDataType, WebCountriesResponseDataType, WebCountriesResponseType, WebCountryType } from "../countries.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";
import { encryptData } from "@/lib/encrypt";
import { decryptData } from "@/lib/decrypt";


export const getCountriesData = async (): Promise<CountriesResponseDataType> => {
    const encryptedPayload = encryptData({});

    const response: CountriesResponseType = await apiCall({
        url: `${URL}/country/get-all`,
        method: 'POST',
        body: {
            payload: encryptedPayload,
        },
    });

    const decryptedData = decryptData(response.data);

    return {
        success: response.success,
        message: response.message,
        countries: decryptedData.countries,
    };
};

export const createCountrySliderData = async (title: string): Promise<CreateCountryResponseDataType> => {
    const body = {
        title: {
            EN: title,
            SN: title,
            TM: title,
        },
    };

    const encryptedPayload = encryptData(body);

    const response: CreateCountryResponseType = await apiCall({
        url: `${URL}/country/create`,
        method: 'POST',
        body: {
            payload: encryptedPayload,
        },
    });

    const decryptedData = decryptData(response.data || "");

    return {
        success: response.success,
        message: response.message,
        data: {
            country: decryptedData.country,
        },
    };
};

export const getWebCountriesData = async (): Promise<WebCountriesResponseDataType> => {
    const response: WebCountriesResponseType = await apiCall({
        url: `${URL}/web_country/get-all`,
        method: 'POST',
    });

    return {
        success: response.success,
        message: response.message,
        countries: response.data.countries || [],
    };
};

export const createWebCountry = async (body: WebCountryType): Promise<CreateWebCountryResponseDataType> => {
    const response: CreateWebCountryResponseType = await apiCall({
        url: `${URL}/web_country/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            country: response.data,
        },
    };
};

export const publishWebCountry = async (id: number, isPublish: boolean): Promise<PublishWebCountryResponseDataType> => {
    const response: PublishWebCountryResponseDataType = await apiCall({
        url: `${URL}/web_country/publish`,
        method: 'POST',
        body: { id, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};