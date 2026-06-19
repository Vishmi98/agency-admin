import * as Yup from 'yup';

import { EventType } from './event.types';


export const addEventInitialValues: EventType = {
    eventName: "",
    images: [],
    imageIds: [],
    isPublish: false,
};

export const addEventValidationSchema = Yup.object({
    eventName: Yup.string().required("Event name is required"),
});