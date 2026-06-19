import * as Yup from 'yup';

import { WebCountryType } from './countries.types';


export const addWebCountryInitialValues: WebCountryType = {
  country: '',
  image: '',
  title: '',
  shortDescription: '',
  popularity: '',
  advantage1: '',
  advantage2: '',
  advantage3: '',
  advantage4: '',
  advantage5: '',
  requirement1: '',
  requirement2: '',
  requirement3: '',
  requirement4: '',
  requirement5: '',
  cost1: '',
  cost2: '',
  cost3: '',
  cost4: '',
  scholarships1: '',
  scholarships2: '',
  scholarships3: '',
  scholarships4: '',
  universities: [],
  url: '',
  isPublish: true
};

export const addWebCountryValidationSchema = Yup.object().shape({
  country: Yup.string().required('Country name is required'),
  image: Yup.string(),
  title: Yup.string().required('Title is required'),
  shortDescription: Yup.string().required('Short description is required'),
  popularity: Yup.string(),

  advantage1: Yup.string(),
  advantage2: Yup.string(),
  advantage3: Yup.string(),
  advantage4: Yup.string(),
  advantage5: Yup.string(),

  requirement1: Yup.string(),
  requirement2: Yup.string(),
  requirement3: Yup.string(),
  requirement4: Yup.string(),
  requirement5: Yup.string(),

  cost1: Yup.string(),
  cost2: Yup.string(),
  cost3: Yup.string(),
  cost4: Yup.string(),

  scholarships1: Yup.string(),
  scholarships2: Yup.string(),
  scholarships3: Yup.string(),
  scholarships4: Yup.string(),

  universities: Yup.array()
    .of(Yup.number().min(0, 'Universities must be a positive value'))
    .default([]),
  url: Yup.string().required('URL is required'),
});
