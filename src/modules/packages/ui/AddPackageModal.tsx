"use client";

import React, { FC, useEffect, useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { Formik, Form, FormikProps, Field, ErrorMessage } from "formik";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';

import { createPackage, getLanguageData, getStudyTypeData } from "../services/packages.service";
import { PackageType } from "../package.types";
import { addPackageInitialValues, addPackageValidationSchema } from "../package.utils";

import TextBox from "@/components/TextBox";
import { DropdownType } from "@/type/common.types";
import { getUniversityData } from "@/modules/university/services/university.services";
import { getCountriesData } from "@/modules/countries/services/countries.services";
import { AddModalProps } from "@/modules/countries/countries.types";
import { getCookieUser } from "@/utils/cookie.util";
import { getQualificationData } from "@/modules/qualification/services/qualification.services";
import { UniversityDataType } from "@/modules/university/university.types";


const AddPackageModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();

    const [universities, setUniversities] = useState<UniversityDataType[]>([]);
    const [countries, setCountries] = useState<DropdownType[]>([]);
    const [qualifications, setQualifications] = useState<DropdownType[]>([]);
    const [studyTypes, setStudyTypes] = useState<DropdownType[]>([]);
    const [languages, setLanguages] = useState<DropdownType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const user = getCookieUser();

    const fetchDropdownData = async () => {
        try {
            const [countriesRes, universitiesRes, qualificationsRes, studyTypesRes, languagesRes] = await Promise.all([
                getCountriesData(),
                getUniversityData(1, 100),
                getQualificationData(),
                getStudyTypeData(),
                getLanguageData(),
            ]);

            if (countriesRes.success) setCountries(countriesRes.countries);
            if (universitiesRes.success) setUniversities(universitiesRes.universities);
            if (qualificationsRes.success) setQualifications(qualificationsRes.qualifications);
            if (studyTypesRes.success) setStudyTypes(studyTypesRes.studyTypes);
            if (languagesRes.success) setLanguages(languagesRes.languages);
        } catch (error) {
            toast.error("Error fetching dropdown data");
        }
    };

    useEffect(() => {
        if (isOpen) fetchDropdownData();
    }, [isOpen]);

    const handleSubmit = async (
        values: PackageType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            setIsLoading(true);
            values.createdBy = user && user.id ? Number(user.id) : 0;
            const response = await createPackage(values);
            if (response.success) {
                toast.success(response.message);
                handleReload();
                onClose();
                resetForm();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the package.");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Dialog
                open={isOpen}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    style: {
                        borderRadius: "10px",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                        backgroundColor: theme.palette.background.paper,
                    },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <DialogTitle
                        sx={{
                            padding: "16px 24px",
                            fontWeight: "bold",
                            position: "sticky",
                            top: 0,
                            zIndex: 1000,
                            color: theme.palette.text.primary,
                        }}
                    >
                        Add New Package
                    </DialogTitle>
                    <CloseIcon data-testid="CloseIcon" sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
                </Box>
                <Formik
                    initialValues={addPackageInitialValues}
                    validationSchema={addPackageValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting, setFieldValue }: FormikProps<PackageType>) => (
                        <Form>
                            <DialogContent
                                sx={{
                                    padding: "10px 24px",
                                    maxHeight: "400px",
                                    overflowY: "auto",
                                    backgroundColor: theme.palette.background.paper,
                                }}
                            >
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Title</Typography>
                                        <TextBox
                                            name="title"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.title && !!errors.title}
                                            helperText={touched.title && errors.title}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Select Country</Typography>
                                        <Field
                                            as="select"
                                            name="countryId"
                                            className="border p-2 w-full rounded-md border-gray-300"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                const selectedId = Number(e.target.value);
                                                setFieldValue('countryId', selectedId);
                                            }}
                                        >
                                            <option value="">Select</option>
                                            {countries.map((country) => (
                                                <option key={country.id} value={country.id}>
                                                    {country.title.EN}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="countryId" component="div" className="text-red-300 text-xs pl-3" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Select University</Typography>
                                        <Autocomplete
                                            options={universities}
                                            getOptionLabel={(option) => option.name}
                                            loading={isLoading}
                                            onChange={(event, value) => {
                                                setFieldValue('uniId', value ? value.id : '');
                                            }}
                                            size="small"
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    placeholder="Search University..."
                                                    fullWidth
                                                    error={touched.uniId && Boolean(errors.uniId)}
                                                    helperText={touched.uniId && errors.uniId}
                                                />
                                            )}
                                        />
                                        <ErrorMessage name="uniId" component="div" className="text-red-300 text-xs pl-3" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Course Name</Typography>
                                        <TextBox
                                            name="courseName"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.courseName && !!errors.courseName}
                                            helperText={touched.courseName && errors.courseName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Select Qualification</Typography>
                                        <Field
                                            as="select"
                                            name="qualification"
                                            className="border p-2 w-full rounded-md border-gray-300"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                const selectedId = Number(e.target.value);
                                                setFieldValue('qualification', selectedId);
                                            }}
                                        >
                                            <option value="">Select</option>
                                            {qualifications.map((qualification) => (
                                                <option key={qualification.id} value={qualification.id}>
                                                    {qualification.title.EN}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="qualification" component="div" className="text-red-300 text-xs pl-3" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Cost (USD)</Typography>
                                        <TextBox
                                            name="cost"
                                            label=""
                                            as="input"
                                            type="number"
                                            fullWidth
                                            error={touched.cost && !!errors.cost}
                                            helperText={touched.cost && errors.cost}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Cost (LKR)</Typography>
                                        <TextBox
                                            name="costInLkr"
                                            label=""
                                            as="input"
                                            type="number"
                                            fullWidth
                                            error={touched.costInLkr && !!errors.costInLkr}
                                            helperText={touched.costInLkr && errors.costInLkr}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Price (USD)</Typography>
                                        <TextBox
                                            name="price"
                                            label=""
                                            as="input"
                                            type="number"
                                            fullWidth
                                            error={touched.price && !!errors.price}
                                            helperText={touched.price && errors.price}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Price (LKR)</Typography>
                                        <TextBox
                                            name="priceInLkr"
                                            label=""
                                            as="input"
                                            type="number"
                                            fullWidth
                                            error={touched.priceInLkr && !!errors.priceInLkr}
                                            helperText={touched.priceInLkr && errors.priceInLkr}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Start Date</Typography>
                                        <TextBox
                                            name="startDate"
                                            label=""
                                            as="input"
                                            type="date"
                                            fullWidth
                                            error={touched.startDate && !!errors.startDate}
                                            helperText={touched.startDate && errors.startDate}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Duration (Years)</Typography>
                                        <TextBox
                                            name="duration"
                                            label=""
                                            as="input"
                                            type="number"
                                            fullWidth
                                            error={touched.duration && !!errors.duration}
                                            helperText={touched.duration && errors.duration}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Next Intake</Typography>
                                        <TextBox
                                            name="nextIntake"
                                            label=""
                                            as="input"
                                            type="date"
                                            fullWidth
                                            error={touched.nextIntake && !!errors.nextIntake}
                                            helperText={touched.nextIntake && errors.nextIntake}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <Typography fontSize="12px">Select Entry Qualification</Typography>
                                            <Field
                                                as="select"
                                                name="entryQualification"
                                                className="border p-2 w-full rounded-md border-gray-300"
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                    const selectedId = Number(e.target.value);
                                                    setFieldValue('entryQualification', selectedId);
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {qualifications.map((qualification) => (
                                                    <option key={qualification.id} value={qualification.id}>
                                                        {qualification.title.EN}
                                                    </option>
                                                ))}
                                            </Field>
                                        </FormControl>
                                        <ErrorMessage name="entryQualification" component="div" className="text-red-300 text-xs pl-3" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Select Study Type</Typography>
                                        <Field
                                            as="select"
                                            name="studyType"
                                            className="border p-2 w-full rounded-md border-gray-300"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                const selectedId = Number(e.target.value);
                                                setFieldValue('studyType', selectedId);
                                            }}
                                        >
                                            <option value="">Select</option>
                                            {studyTypes.map((studyType) => (
                                                <option key={studyType.id} value={studyType.id}>
                                                    {studyType.title.EN}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="studyType" component="div" className="text-red-300 text-xs pl-3" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Select Language</Typography>
                                        <Field
                                            as="select"
                                            name="language"
                                            className="border p-2 w-full rounded-md border-gray-300"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                const selectedId = Number(e.target.value);
                                                setFieldValue('language', selectedId);
                                            }}
                                        >
                                            <option value="">Select</option>
                                            {languages.map((language) => (
                                                <option key={language.id} value={language.id}>
                                                    {language.title.EN}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="language" component="div" className="text-red-300 text-xs pl-3" />
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions
                                sx={{
                                    padding: "16px 24px",
                                    gap: "8px",
                                    position: "sticky",
                                    bottom: 0,
                                    backgroundColor: theme.palette.background.paper,
                                    zIndex: 1000,
                                }}
                            >
                                <Button
                                    onClick={onClose}
                                    color="secondary"
                                    sx={{
                                        backgroundColor: "#f5f5f5",
                                        color: "#555",
                                        borderRadius: "5px",
                                        textTransform: "none",
                                        "&:hover": { backgroundColor: "#e0e0e0" },
                                        width: "200px"
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    sx={{
                                        backgroundColor: "#1976d2",
                                        borderRadius: "5px",
                                        textTransform: "none",
                                        "&:hover": { backgroundColor: "#115293" },
                                        width: "200px"
                                    }}
                                >
                                    Save Package
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
            <ToastContainer />
        </>
    );
};

export default AddPackageModal;
