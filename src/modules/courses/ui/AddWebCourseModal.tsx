"use client";

import React, { FC, useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Grid,
    useTheme,
    Box,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';

import { WebCourseType } from "../courses.types";
import { createWebCourse } from "../services/courses.service";
import { addWebCourseInitialValues, addWebCourseValidationSchema } from "../courses.utils";

import TextBox from "@/components/TextBox";
import { AddModalProps } from "@/modules/countries/countries.types";
import { WebUniversityDataType } from "@/modules/university/university.types";
import { getWebUniversities } from "@/modules/university/services/university.services";
import { DropdownType } from "@/type/common.types";
import { getQualificationData } from "@/modules/qualification/services/qualification.services";
import { getStudyTypeData } from "@/modules/packages/services/packages.service";


const AddWebCourseModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();

    const [universities, setUniversities] = useState<WebUniversityDataType[]>([]);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [qualifications, setQualifications] = useState<DropdownType[]>([]);
    const [studyTypes, setStudyTypes] = useState<DropdownType[]>([]);

    const fetchDropdownData = async () => {
        try {
            const [universitiesRes, qualificationsRes, studyTypesRes] = await Promise.all([
                getWebUniversities(1, 100),
                getQualificationData(),
                getStudyTypeData(),
            ]);

            if (universitiesRes.success) setUniversities(universitiesRes.universities);
            if (qualificationsRes.success) setQualifications(qualificationsRes.qualifications);
            if (studyTypesRes.success) setStudyTypes(studyTypesRes.studyTypes);
        } catch (error) {
            toast.error("Error fetching dropdown data");
        }
    };

    useEffect(() => {
        if (isOpen) fetchDropdownData();
    }, [isOpen]);

    const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setCoverImageFile(file);
    };

    const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files).slice(0, 3);
            setImageFiles(fileArray);
        }
    };

    const handleSubmit = async (
        values: WebCourseType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            const response = await createWebCourse(values);
            if (response.success) {
                toast.success(response.message);

                resetForm(); // Reset form first

                onClose();        // Close modal after delay
                handleReload();   // Trigger table reload
                setCoverImageFile(null);
                setImageFiles([]);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the course.");
            console.log(error);
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
                        Add New Course
                    </DialogTitle>
                    <CloseIcon data-testid="CloseIcon" sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
                </Box>
                <Formik
                    initialValues={addWebCourseInitialValues}
                    validationSchema={addWebCourseValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting, setFieldValue }: FormikProps<WebCourseType>) => (
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
                                        <Typography fontSize="12px">Qualification</Typography>
                                        <Field
                                            as="select"
                                            name="qualification"
                                            className="border p-2 w-full rounded-md border-gray-300"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                setFieldValue('qualification', e.target.value);
                                            }}
                                        >
                                            <option value="">Select Qualification</option>
                                            {qualifications.map((q) => (
                                                <option key={q.id} value={q.id}>
                                                    {q.title.EN}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="qualification" component="div" className="text-red-300 text-xs ml-3 mt-2" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Duration (in months/years)</Typography>
                                        <TextBox
                                            as="input"
                                            name="duration"
                                            label=""
                                            type="number"
                                            fullWidth
                                            error={touched.duration && !!errors.duration}
                                            helperText={touched.duration && errors.duration}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Next Intake</Typography>
                                        <TextBox
                                            as="input"
                                            name="nextIntake"
                                            label=""
                                            type="month"
                                            fullWidth
                                            error={touched.nextIntake && !!errors.nextIntake}
                                            helperText={touched.nextIntake && errors.nextIntake}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Study Type</Typography>
                                        <Field
                                            as="select"
                                            name="studyType"
                                            className="border p-2 w-full rounded-md border-gray-300"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                setFieldValue('studyType', e.target.value);
                                            }}
                                        >
                                            <option value="">Select Study Type</option>
                                            {studyTypes.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.title.EN}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="studyType" component="div" className="text-red-300 text-xs ml-3 mt-2" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Overview</Typography>
                                        <TextBox
                                            name="overview"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.overview && !!errors.overview}
                                            helperText={touched.overview && errors.overview}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">University</Typography>
                                        <Field
                                            as="select"
                                            name="uniId"
                                            className="border p-2 w-full rounded-md border-gray-300"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                setFieldValue('uniId', Number(e.target.value));
                                            }}
                                        >
                                            <option value="">Select University</option>
                                            {universities.map((uni) => (
                                                <option key={uni.id} value={uni.id}>
                                                    {uni.name}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="uniId" component="div" className="text-red-300 text-xs ml-3 mt-2" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Rank</Typography>
                                        <TextBox
                                            as="input"
                                            name="rank"
                                            label=""
                                            type="number"
                                            fullWidth
                                            error={touched.rank && !!errors.rank}
                                            helperText={touched.rank && errors.rank}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Entry Score</Typography>
                                        <TextBox
                                            as="input"
                                            name="entryScore"
                                            label=""
                                            type="text"
                                            fullWidth
                                            error={touched.entryScore && !!errors.entryScore}
                                            helperText={touched.entryScore && errors.entryScore}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Price</Typography>
                                        <TextBox
                                            as="input"
                                            name="price"
                                            label=""
                                            type="number"
                                            fullWidth
                                            error={touched.price && !!errors.price}
                                            helperText={touched.price && errors.price}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">URL</Typography>
                                        <TextBox
                                            as="input"
                                            name="url"
                                            label=""
                                            type="text"
                                            fullWidth
                                            error={touched.url && !!errors.url}
                                            helperText={touched.url && errors.url}
                                        />
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
                                    Add
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

export default AddWebCourseModal;
