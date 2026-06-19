export type AwardType = {
    year: string;
    title: string;
    images: string[];
    imageIds: string[];
    isPublish: boolean;
}

export type AwardDataType = {
    id: number;
    year: string;
    title: string;
    images: string[];
    imageIds: string[];
    isPublish: boolean;
}

export type CreateAwardResponseType = {
    success: boolean;
    message: string;
    data: AwardType;
}

export type CreateAwardResponseDataType = {
    success: boolean;
    message: string;
    data: {
        award: AwardType;
    }
}

export type AwardsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalAwards: number;
    awards: AwardDataType[];
}

export type AwardsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalAwards: number;
        awards: AwardDataType[];
    }
}

export type PublishAwardResponseDataType = {
    success: boolean;
    message: string;
    data: AwardType
}
