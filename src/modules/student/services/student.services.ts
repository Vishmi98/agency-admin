import { CreateStudentResponseDataType, CreateStudentResponseType, StudentsResponseDataType, StudentsResponseType, StudentStatusResponseDataType, StudentStatusResponseType, StudentType, UpdateStudentResponseDataType, UpdateStudentResponseType, VisaStatusResponseDataType, VisaStatusResponseType } from "../student.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getStudentData = async (page: number, limit?: number, search?: string): Promise<StudentsResponseDataType> => {
    const response: StudentsResponseType = await apiCall({
        url: `${URL}/student/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5, search: search || '' },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        students: data.students || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalStudents: data.totalStudents ?? 0,
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
    const response: CreateStudentResponseType = await apiCall({
        url: `${URL}/auth/create_new`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            student: response.data,
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
    const response: UpdateStudentResponseType = await apiCall({
        url: `${URL}/student/update`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            student: response.data,
        },
    };
};

export const getVisaStatuses = async (): Promise<VisaStatusResponseDataType> => {
    const response: VisaStatusResponseType = await apiCall({
        url: `${URL}/visa-status-type/get-all`,
        method: 'POST',
    })

    return ({
        success: response.success,
        message: response.message,
        visaStatusTypes: response.data.visaStatusTypes || []
    });
};