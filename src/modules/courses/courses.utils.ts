import * as Yup from 'yup';

import { CourseType, WebCourseType } from "./courses.types";


export const addWebCourseInitialValues: WebCourseType = {
  courseName: '',
  qualification: '',
  duration: 0,
  nextIntake: '',
  studyType: '',
  overview: '',
  uniId: '',
  rank: 0,
  entryScore: '',
  price: 0,
  url: '',
  coverImage: '',
  coverImageId: '',
  images: [],
  imageIds: [],
  isPublish: true
};

export const addWebCourseValidationSchema = Yup.object().shape({
  courseName: Yup.string().required('Course name is required'),
  qualification: Yup.number(),
  duration: Yup.number(),
  nextIntake: Yup.string(),
  studyType: Yup.number(),
  overview: Yup.string(),
  uniId: Yup.number(),
  rank: Yup.number(),
  entryScore: Yup.string(),
  price: Yup.number(),
  url: Yup.string(),
});

export const addCourseInitialValues: CourseType = {
  title: "",
  shortCode: "",
  description: "",

  universityId: 0,

  level: "",
  credits: 0,
  duration: "",

  structure: "",

  specializations: [],
  intakes: [],
  entryRequirements: [],

  englishRequirement: {
    test: "",
    overallScore: 0,
    minimumBand: 0,
  },

  careerOpportunities: [],
  features: [],

  tuitionFee: 0,
  applicationFee: 0,

  isActive: true,
};

export const addCourseValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required"),

  shortCode: Yup.string(),

  description: Yup.string(),

  universityId: Yup.number()
    .required("University is required")
    .moreThan(0, "University is required"),

  level: Yup.string()
    .required("Level is required"),

  credits: Yup.number()
    .required("Credits are required")
    .min(1, "Credits must be greater than 0"),

  duration: Yup.string()
    .required("Duration is required"),

  structure: Yup.string(),

  specializations: Yup.array()
    .of(Yup.string())
    .min(1, "At least one specialization is required"),

  intakes: Yup.array()
    .of(Yup.string())
    .min(1, "At least one intake is required"),

  entryRequirements: Yup.array()
    .of(Yup.string())
    .min(1, "At least one entry requirement is required"),

  englishRequirement: Yup.object().shape({
    test: Yup.string()
      .required("English test is required"),

    overallScore: Yup.number()
      .required("Overall score is required")
      .min(0),

    minimumBand: Yup.number()
      .required("Minimum band score is required")
      .min(0),
  }),

  careerOpportunities: Yup.array()
    .of(Yup.string()),

  features: Yup.array()
    .of(Yup.string()),

  tuitionFee: Yup.number()
    .min(0),

  applicationFee: Yup.number()
    .min(0),

  isActive: Yup.boolean()
});