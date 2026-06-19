import * as Yup from 'yup';

import { AwardType } from './award.types';


export const addAwardInitialValues: AwardType = {
    year: "",
    title: "",
    images: [],
    imageIds: [],
    isPublish: false,
};

export const addAwardValidationSchema = Yup.object({
    year: Yup.string().required("Year is required"),
    title: Yup.string().required("Title is required"),
});