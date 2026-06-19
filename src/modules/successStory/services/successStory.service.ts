import axios from "axios";

import { CreateSuccessStoryResponseDataType, CreateSuccessStoryResponseType, PublishSuccessStoryResponseDataType, SuccessStoryResponseDataType, SuccessStoryResponseType } from "../successStory.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getSuccessStories = async (page: number, limit?: number): Promise<SuccessStoryResponseDataType> => {
    const response: SuccessStoryResponseType = await apiCall({
        url: `${URL}/successStory/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        successStories: data.successStories || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalSuccessStories: data.totalSuccessStories ?? 0,
    };
};

export const createSuccessStory = async (formData: FormData): Promise<CreateSuccessStoryResponseDataType> => {
    const response: CreateSuccessStoryResponseType = await axios.post(
        `${URL}/successStory/create`,
        formData,
    );

    return {
        success: response.success,
        message: response.message,
        data: {
            successStory: response.data,
        },
    };
};

export const publishSuccessStory = async (successStoryId: number, isPublish: boolean): Promise<PublishSuccessStoryResponseDataType> => {
    const response: PublishSuccessStoryResponseDataType = await apiCall({
        url: `${URL}/successStory/publish`,
        method: 'POST',
        body: { successStoryId, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const deleteSuccessStory = async (
    id: number
): Promise<PublishSuccessStoryResponseDataType> => {
    const response: PublishSuccessStoryResponseDataType = await apiCall({
        url: `${URL}/successStory/delete`,
        method: "POST",
        body: { id },
    });

    return {
        success: response.success ?? false,
        message: response.message || "Failed to delete success story",
        data: response.data,
    };
};
