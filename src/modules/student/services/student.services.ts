import { CreateStudentResponseDataType, CreateStudentResponseType, StudentsResponseDataType, StudentsResponseType, StudentStatusResponseDataType, StudentStatusResponseType, StudentType, UpdateStudentResponseDataType, UpdateStudentResponseType, VisaStatusResponseDataType, VisaStatusResponseType } from "../student.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";
import { encryptData } from "@/lib/encrypt";
import { decryptData } from "@/lib/decrypt";


export const getStudentData = async (page: number, limit?: number, search?: string): Promise<StudentsResponseDataType> => {
    const encryptedPayload = encryptData({
        page,
        limit: limit || 5,
        search: search || ''
    });


    const response: StudentsResponseType = await apiCall({
        url: `${URL}/student/get-all`,
        method: 'POST',
        body: {
            payload: encryptedPayload,
        },
    });

    const decryptedData = decryptData(response.data);

    return {
        success: response.success,
        message: response.message,
        students: decryptedData.students,
        page: decryptedData.page,
        limit: decryptedData.limit,
        totalPages: decryptedData.totalPages,
        totalStudents: decryptedData.totalStudents,
    };
};

export const getStudentStatuses = async (): Promise<StudentStatusResponseDataType> => {
    const response: StudentStatusResponseType = await apiCall({
        url: `${URL}/student-status-type/get-all`,
        method: 'POST',
    })

    return ({
        success: response.success,
        message: response.message,
        studentStatus: response.data.studentStatus,
    });
};

export const createStudent = async (body: StudentType): Promise<CreateStudentResponseDataType> => {
    const encryptedPayload = encryptData(body);

    const response: CreateStudentResponseType = await apiCall({
        url: `${URL}/auth/create_new`,
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
            student: decryptedData.student,
        },
    };
};

export const createQualification = async (qualificationData: any) => {
    try {
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: "Qualification added successfully!",
                    data: qualificationData,
                });
            }, 1000);
        });

        return response;
    } catch (error) {
        throw new Error("Failed to create qualification");
    }
};

export const updateStudent = async (id: string | number, body: StudentType): Promise<UpdateStudentResponseDataType> => {
    const { id: _, ...restBody } = body;

    const encryptedPayload = encryptData({
        id,
        ...restBody,
    });

    const response: UpdateStudentResponseType = await apiCall({
        url: `${URL}/student/update`,
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
            student: decryptedData.student,
        },
    };
};

export const getVisaStatuses = async (): Promise<VisaStatusResponseDataType> => {
    const encryptedPayload = encryptData({});

    const response: VisaStatusResponseType = await apiCall({
        url: `${URL}/visa-status-type/get-all`,
        method: 'POST',
        body: {
            payload: encryptedPayload,
        },
    })

    const decryptedData = decryptData(response.data);

    return ({
        success: response.success,
        message: response.message,
        visaStatusTypes: decryptedData.visaStatusTypes || []
    });
};