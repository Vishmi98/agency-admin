import * as Yup from 'yup';

import { SuccessStoryType } from './successStory.types';


export const addSuccessStoryInitialValues: SuccessStoryType = {
    documentId: '',
    documentPath: '',
    isPublish: false
};

export const addSuccessStoryValidationSchema = Yup.object({
    documentId: Yup.string(),
    documentPath: Yup.string(),
});
