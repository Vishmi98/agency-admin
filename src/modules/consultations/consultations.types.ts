import { DropdownType } from "@/type/common.types";
import { WebCountryDataType } from "../countries/countries.types";
import { WebCourseDataType } from "../courses/courses.types";
import { WebUniversityDataType } from "../university/university.types";

export type WebConsultationType = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
}

export type WebConsultationDataType = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryId: number;
    universityId: number;
    courseId: number;
    branchId: number;
    studyLevelId: number;
    message: string;
    status: number;
    countryInfo: WebCountryDataType;
    uniInfo: WebUniversityDataType;
    courseInfo: WebCourseDataType;
    branchInfo: DropdownType;
    studyInfo: DropdownType;
    statusInfo: {
        id: number;
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        color: string;
    }
}

export type WebConsultationsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalLeads: number;
    leads: WebConsultationDataType[];
}

export type WebConsultationsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalLeads: number;
        leads: WebConsultationDataType[];
    }
}

export type UpdateConsultationResponseDataType = {
    success: boolean;
    message: string;
    data: {
        lead: WebConsultationType;
    }
}

export type UpdateConsultationResponseType = {
    success: boolean;
    message: string;
    data: WebConsultationType;
}