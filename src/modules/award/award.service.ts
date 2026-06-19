import axios from "axios";

import { AwardsResponseDataType, AwardsResponseType, CreateAwardResponseDataType, CreateAwardResponseType, PublishAwardResponseDataType } from "./award.types";

import { URL } from "@/constants/config";
import apiCall from "@/services/api.services";


export const createAward = async (formData: FormData): Promise<CreateAwardResponseDataType> => {
    const response: CreateAwardResponseType = await axios.post(
        `${URL}/web_award/create`,
        formData,
    );

    return {
        success: response.success,
        message: response.message,
        data: {
            award: response.data,
        },
    };
};

export const getAwards = async (page: number, limit?: number): Promise<AwardsResponseDataType> => {
    const response: AwardsResponseType = await apiCall({
        url: `${URL}/web_award/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        awards: data.awards || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalAwards: data.totalAwards ?? 0,
    };
};

export const publishAward = async (awardId: number, isPublish: boolean): Promise<PublishAwardResponseDataType> => {
    const response: PublishAwardResponseDataType = await apiCall({
        url: `${URL}/web_award/publish`,
        method: 'POST',
        body: { awardId, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const deleteAward = async (
    id: number
): Promise<PublishAwardResponseDataType> => {
    const response: PublishAwardResponseDataType = await apiCall({
        url: `${URL}/web_award/delete`,
        method: "POST",
        body: { id },
    });

    return {
        success: response.success ?? false,
        message: response.message || "Failed to delete award",
        data: response.data,
    };
};

export const addImages = async (data: FormData) => {
    const res = await axios.post(`${URL}/web_award/add-images`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            award: response.data,
        },
    };
};

export const deleteAwardImage = async (id: number, imageId: string) => {
    const res = await axios.post(`${URL}/web_award/delete-image`, {
        id,
        imageId,
    });

    return res.data;
};