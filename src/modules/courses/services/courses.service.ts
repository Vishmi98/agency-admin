import axios from "axios";

import { CoursesResponseDataType, CoursesResponseType, CourseType, CreateCourseResponseDataType, CreateCourseResponseType, CreateWebCourseResponseDataType, CreateWebCourseResponseType, PublishWebCourseResponseDataType, UpdateCourseResponseDataType, UpdateCourseResponseType, WebCoursesResponseDataType, WebCoursesResponseType, WebCourseType } from "../courses.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";
import { encryptData } from "@/lib/encrypt";
import { decryptData } from "@/lib/decrypt";


export const getWebCoursesData = async (page: number, limit?: number): Promise<WebCoursesResponseDataType> => {
    const response: WebCoursesResponseType = await apiCall({
        url: `${URL}/web_course/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success,
        message: response.message,
        courses: response.data.courses || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalCourses: data.totalCourses ?? 0,
    };
};

export const createWebCourse = async (body: WebCourseType): Promise<CreateWebCourseResponseDataType> => {
    const response: CreateWebCourseResponseType = await apiCall({
        url: `${URL}/web_course/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            course: response.data,
        },
    };
};

export const publishWebCourse = async (id: number, isPublish: boolean): Promise<PublishWebCourseResponseDataType> => {
    const response: PublishWebCourseResponseDataType = await apiCall({
        url: `${URL}/web_course/publish`,
        method: 'POST',
        body: { id, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const getCoursesData = async (
    page: number,
    limit?: number,
    search?: string
): Promise<CoursesResponseDataType> => {
    const encryptedPayload = encryptData({
        page,
        limit: limit || 5,
        search: search || "",
    });

    const response: CoursesResponseType = await apiCall({
        url: `${URL}/course/get-all`,
        method: "POST",
        body: {
            payload: encryptedPayload,
        },
    });

    const decryptedData = decryptData(response.data);

    return {
        success: response.success,
        message: response.message,
        courses: decryptedData.courses,
        page: decryptedData.page,
        limit: decryptedData.limit,
        totalPages: decryptedData.totalPages,
        totalCourses: decryptedData.totalCourses,
    };
};

export const createCourse = async (body: CourseType): Promise<CreateCourseResponseDataType> => {
    const encryptedPayload = encryptData(body);

    const response: CreateCourseResponseType = await apiCall({
        url: `${URL}/course/create`,
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
            course: decryptedData.course,
        },
    };
};

export const updateCourse = async (id: string | number, body: CourseType): Promise<UpdateCourseResponseDataType> => {
    const { id: _, ...restBody } = body;

    const encryptedPayload = encryptData({
        id,
        ...restBody,
    });

    const response: UpdateCourseResponseType = await apiCall({
        url: `${URL}/course/update`,
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
            course: decryptedData.course,
        },
    };
};