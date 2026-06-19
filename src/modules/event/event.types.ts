export type EventType = {
    eventName: string;
    images: string[];
    imageIds: string[];
    isPublish: boolean;
}

export type EventDataType = {
    id: number;
    eventName: string;
    images: string[];
    imageIds: string[];
    isPublish: boolean;
}

export type CreateEventResponseType = {
    success: boolean;
    message: string;
    data: EventType;
}

export type CreateEventResponseDataType = {
    success: boolean;
    message: string;
    data: {
        event: EventType;
    }
}

export type EventsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalEvents: number;
    events: EventDataType[];
}

export type EventsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalEvents: number;
        events: EventDataType[];
    }
}

export type PublishEventResponseDataType = {
    success: boolean;
    message: string;
    data: EventType
}
