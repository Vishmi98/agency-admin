export type SuccessStoryDataType = {
    id: number;
    documentPath: string;
    documentId: string;
    isPublish: boolean;
}

export type SuccessStoryType = {
    documentPath: string;
    documentId: string;
    isPublish: boolean;
}

export type SuccessStoryResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalSuccessStories: number;
    successStories: SuccessStoryDataType[];
}

export type SuccessStoryResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalSuccessStories: number;
        successStories: SuccessStoryDataType[];
    }
}

export type CreateSuccessStoryResponseType = {
    success: boolean;
    message: string;
    data: SuccessStoryType;
}

export type CreateSuccessStoryResponseDataType = {
    success: boolean;
    message: string;
    data: {
        successStory: SuccessStoryType;
    }
}

export type PublishSuccessStoryResponseDataType = {
    success: boolean;
    message: string;
    data: SuccessStoryType
}
