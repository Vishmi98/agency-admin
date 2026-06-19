import { DropdownType } from "@/type/common.types";
import { UniversityDataType, WebUniversityDataType } from "../university/university.types";

export type WebCourseType = {
    courseName: string;
    qualification: number | string;
    duration: number;
    nextIntake: string;
    studyType: number | string;
    overview: string;
    uniId: number | string;
    rank: number;
    entryScore: string;
    price: number;
    url: string;
    coverImage: string; // image
    coverImageId: string;
    images: string[]; // only 3 images array
    imageIds: string[];
    isPublish: boolean;
}

export type WebCourseDataType = {
    id: number;
    courseName: string;
    qualification: number;
    duration: number;
    nextIntake: string;
    studyType: number;
    overview: string;
    uniId: number;
    rank: number;
    entryScore: string;
    price: number;
    url: string;
    coverImage: string; // image
    coverImageId: string;
    images: string[]; // only 3 images array
    imageIds: string[];
    uniInfo: WebUniversityDataType;
    studyTypeInfo?: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
    qualificationInfo: {
        title: {
            SN: string;
            EN: string;
            TM: string;
        };
        id: number;
    };
    isPublish: boolean;
}

export type WebCoursesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalCourses: number;
        courses: WebCourseDataType[]
    };
}

export type WebCoursesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalCourses: number;
    courses: WebCourseDataType[] | []
}

export type CreateWebCourseResponseType = {
    success: boolean;
    message: string;
    data: WebCourseType;
}

export type CreateWebCourseResponseDataType = {
    success: boolean;
    message: string;
    data: {
        course: WebCourseType;
    }
}

export type PublishWebCourseResponseDataType = {
    success: boolean;
    message: string;
    data: WebCourseType
}

export type CourseType = {
    title: string;
    shortCode?: string;
    description?: string;
    universityId: number;
    level: string; // NZQA Level 9
    credits: number;
    duration: string; // 18 Months
    structure?: string;
    specializations: string[];
    intakes: string[];
    entryRequirements: string[];
    englishRequirement: {
        test: string; // IELTS Academic
        overallScore: number;
        minimumBand: number;
    };
    careerOpportunities: string[];
    features: string[];
    tuitionFee?: number;
    applicationFee?: number;
    isActive: boolean;
}

export type CourseDataType = {
    id: number;
    title: string;
    shortCode?: string;
    description?: string;
    universityId: number;
    level: string; // NZQA Level 9
    credits: number;
    duration: string; // 18 Months
    structure?: string;
    specializations: string[];
    intakes: string[];
    entryRequirements: string[];
    englishRequirement: {
        test: string; // IELTS Academic
        overallScore: number;
        minimumBand: number;
    };
    careerOpportunities: string[];
    features: string[];
    tuitionFee?: number;
    applicationFee?: number;
    isActive: boolean;
    universityInfo: UniversityDataType;
}

export type CoursePageStateType = {
    courses: CourseDataType[];
    isLoading: boolean;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
    isOpen: boolean;
};

export const coursePageInitialState: CoursePageStateType = {
    courses: [],
    isLoading: true,
    page: 0,
    limit: 5,
    totalRows: 0,
    search: "",
    isOpen: false
};

export const coursePageReducer = (
    state: CoursePageStateType,
    action: { type: string; payload?: Partial<CoursePageStateType> }
) => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'reset':
            return coursePageInitialState;
        default:
            throw new Error('Invalid action type');
    }
};

export type CourseTableProps = {
    totalRows: number,
    courses: CourseDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    reloadData: () => void
}

export type CourseSearchProps = {
    onSearch: () => void;
    setSearch: (i: string) => void,
    search: string,
    loading: boolean,
    handleClearSearch: () => void
}

export type CoursesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalCourses: number;
    courses: CourseDataType[];
}

export type CoursesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalCourses: number;
        courses: CourseDataType[];
    }
}

export type CreateCourseResponseType = {
    success: boolean;
    message: string;
    data: CourseType;
}

export type CreateCourseResponseDataType = {
    success: boolean;
    message: string;
    data: {
        course: CourseType;
    }
}