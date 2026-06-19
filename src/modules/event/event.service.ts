import axios from "axios";

import { CreateEventResponseDataType, CreateEventResponseType, EventsResponseDataType, EventsResponseType, PublishEventResponseDataType } from "./event.types";

import { URL } from "@/constants/config";
import apiCall from "@/services/api.services";


export const createEvent = async (formData: FormData): Promise<CreateEventResponseDataType> => {
    const response: CreateEventResponseType = await axios.post(
        `${URL}/web_events/create`,
        formData,
    );

    return {
        success: response.success,
        message: response.message,
        data: {
            event: response.data,
        },
    };
};

export const getEvents = async (page: number, limit?: number): Promise<EventsResponseDataType> => {
    const response: EventsResponseType = await apiCall({
        url: `${URL}/web_events/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        events: data.events || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalEvents: data.totalEvents ?? 0,
    };
};

export const publishEvent = async (eventId: number, isPublish: boolean): Promise<PublishEventResponseDataType> => {
    const response: PublishEventResponseDataType = await apiCall({
        url: `${URL}/web_events/publish`,
        method: 'POST',
        body: { eventId, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const deleteEvent = async (
    id: number
): Promise<PublishEventResponseDataType> => {
    const response: PublishEventResponseDataType = await apiCall({
        url: `${URL}/web_events/delete`,
        method: "POST",
        body: { id },
    });

    return {
        success: response.success ?? false,
        message: response.message || "Failed to delete event",
        data: response.data,
    };
};

export const addImages = async (data: FormData) => {
    const res = await axios.post(`${URL}/web_events/add-images`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            event: response.data,
        },
    };
};

export const deleteEventImage = async (id: number, imageId: string) => {
    const res = await axios.post(`${URL}/web_events/delete-image`, {
        id,
        imageId,
    });

    return res.data;
};