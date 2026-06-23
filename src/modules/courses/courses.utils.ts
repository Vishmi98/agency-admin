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
  id: 0,
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

  englishRequirement: [{
    test: "",
    overallScore: 0,
    minimumBand: 0,
  }],

  careerOpportunities: [],
  features: [],

  tuitionFee: 0,
  applicationFee: 0,

  isActive: true,
};

export const addCourseValidationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),

  shortCode: Yup.string(),

  description: Yup.string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(220, "Description must not exceed 220 characters"),

  universityId: Yup.number()
    .required("University is required")
    .moreThan(0, "University is required"),

  level: Yup.string()
    .trim()
    .required("Level is required")
    .min(2, "Level is too short")
    .max(50, "Level must not exceed 50 characters"),

  credits: Yup.number()
    .required("Credits are required")
    .min(1, "Credits must be greater than 0"),

  duration: Yup.string()
    .trim()
    .required("Duration is required")
    .min(2, "Duration is too short")
    .max(50, "Duration must not exceed 50 characters"),

  structure: Yup.string()
    .trim()
    .max(500, "Structure must not exceed 500 characters"),

  specializations: Yup.array()
    .of(
      Yup.string()
        .trim()
        .required("Specialization is required")
        .min(2, "Specialization must be at least 2 characters")
        .max(100, "Specialization must not exceed 100 characters")
    )
    .min(1, "At least one specialization is required")
    .max(15, "Maximum 15 specializations allowed"),

  intakes: Yup.array()
    .of(
      Yup.string()
        .trim()
        .max(50, "Intake must not exceed 50 characters")
    )
    .max(12, "Maximum 12 intakes allowed"),

  entryRequirements: Yup.array()
    .of(
      Yup.string()
        .trim()
        .required("Entry requirement is required")
        .min(5, "Entry requirement must be at least 5 characters")
        .max(200, "Entry requirement must not exceed 200 characters")
    )
    .min(1, "At least one entry requirement is required")
    .max(15, "Maximum 15 entry requirements allowed"),

  englishRequirement: Yup.array()
    .of(
      Yup.object().shape({
        test: Yup.string()
          .trim()
          .required("English test is required")
          .max(50, "Test name must not exceed 50 characters"),

        overallScore: Yup.number()
          .required("Overall score is required")
          .min(0, "Overall score cannot be negative")
          .max(100, "Overall score is too high"),

        minimumBand: Yup.number()
          .required("Minimum band score is required")
          .min(0, "Minimum band score cannot be negative")
          .max(100, "Minimum band score is too high"),
      })
    )
    .min(1, "At least one English requirement is required")
    .max(10, "Maximum 10 English requirements allowed"),

  careerOpportunities: Yup.array()
    .of(
      Yup.string()
        .trim()
        .max(100, "Career opportunity must not exceed 100 characters")
    )
    .max(15, "Maximum 15 career opportunities allowed"),

  features: Yup.array()
    .of(
      Yup.string()
        .trim()
        .required("Feature is required")
        .min(2, "Feature must be at least 2 characters")
        .max(200, "Feature must not exceed 200 characters")
    )
    .min(1, "At least one feature is required")
    .max(10, "Maximum 10 features allowed"),

  tuitionFee: Yup.number()
    .nullable()
    .min(0, "Tuition fee cannot be negative")
    .max(1000000, "Tuition fee is too high"),

  applicationFee: Yup.number()
    .nullable()
    .min(0, "Application fee cannot be negative")
    .max(100000, "Application fee is too high"),

  isActive: Yup.boolean()
});