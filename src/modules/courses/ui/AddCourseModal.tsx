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
import CloseIcon from '@mui/icons-material/Close';

import { CourseType } from "../courses.types";
import { createCourse } from "../services/courses.service";
import { addCourseInitialValues, addCourseValidationSchema } from "../courses.utils";

import TextBox from "@/components/TextBox";
import { getUniversityData } from "@/modules/university/services/university.services";
import { AddModalProps } from "@/modules/countries/countries.types";
import { UniversityDataType } from "@/modules/university/university.types";


const AddCourseModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();

    const [universities, setUniversities] = useState<UniversityDataType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        try {
            const [universitiesRes] = await Promise.all([
                getUniversityData(1, 100),
            ]);

            if (universitiesRes.success) setUniversities(universitiesRes.universities);
        } catch (error) {
            toast.error("Error fetching data");
        }
    };

    useEffect(() => {
        if (isOpen) fetchData();
    }, [isOpen]);

    const handleSubmit = async (
        values: CourseType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            setIsLoading(true);

            const response = await createCourse(values);

            if (response.success) {
                toast.success(response.message);
                handleReload();
                onClose();
                resetForm();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the course.");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const ArrayInput = ({
        label,
        value,
        setFieldValue,
        fieldName,
        placeholder,
    }: {
        label: string;
        value: string[];
        setFieldValue: (field: string, value: any) => void;
        fieldName: string;
        placeholder?: string;
    }) => {
        const [input, setInput] = useState("");

        const handleAdd = () => {
            if (!input.trim()) return;

            setFieldValue(fieldName, [...value, input.trim()]);
            setInput("");
        };

        const handleRemove = (index: number) => {
            const updated = value.filter((_, i) => i !== index);
            setFieldValue(fieldName, updated);
        };

        return (
            <Box>
                <Typography fontSize="12px">{label}</Typography>

                <Box display="flex" gap={1}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder={placeholder}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Box sx={{ alignItems: "center", justifyContent: "center", mt: 0.5}}>
                        <Button
                            variant="contained"
                            onClick={handleAdd}
                            size="small"
                            sx={{ fontSize: "12px" }}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>

                {/* Chips list */}
                <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {value?.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                pl: 1,
                                background: "#eee",
                                borderRadius: "5px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                            }}
                        >
                            <Typography fontSize="12px">
                                {item}
                            </Typography>

                            <Button
                                size="small"
                                color="error"
                                onClick={() => handleRemove(index)}
                                sx={{ justifyContent: "flex-end" }}
                            >
                                x
                            </Button>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
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
                        Add New Lead
                    </DialogTitle>
                    <CloseIcon data-testid="CloseIcon" sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
                </Box>
                <Formik
                    initialValues={addCourseInitialValues}
                    validationSchema={addCourseValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting, setFieldValue, values }: FormikProps<CourseType>) => (
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
                                        <Typography fontSize="12px">Short Code</Typography>
                                        <TextBox
                                            name="shortCode"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.shortCode && !!errors.shortCode}
                                            helperText={touched.shortCode && errors.shortCode}
                                        />
                                    </Grid>


                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Level</Typography>
                                        <TextBox
                                            name="level"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.level && !!errors.level}
                                            helperText={touched.level && errors.level}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Description</Typography>

                                        <TextBox
                                            name="description"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.description && !!errors.description}
                                            helperText={touched.description && errors.description}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Select University</Typography>
                                        <Autocomplete
                                            options={universities}
                                            getOptionLabel={(option) => option.name}
                                            loading={isLoading}
                                            onChange={(event, value) => {
                                                setFieldValue('universityId', value ? value.id : '');
                                            }}
                                            size="small"
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    placeholder="Search University..."
                                                    fullWidth
                                                    error={touched.universityId && Boolean(errors.universityId)}
                                                    helperText={touched.universityId && errors.universityId}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Credits</Typography>
                                        <TextBox
                                            name="credits"
                                            label=""
                                            as="input"
                                            type="number"
                                            fullWidth
                                            error={touched.credits && !!errors.credits}
                                            helperText={touched.credits && errors.credits}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Duration</Typography>
                                        <TextBox
                                            name="duration"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.duration && !!errors.duration}
                                            helperText={touched.duration && errors.duration}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Structure</Typography>

                                        <Field
                                            as={TextField}
                                            name="structure"
                                            multiline
                                            rows={3}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography
                                            fontWeight={600}
                                            sx={{ my: 1 }}
                                        >
                                            English Requirement
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <TextBox
                                            name="englishRequirement.test"
                                            label="Test"
                                            as="input"
                                            type="text"
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <TextBox
                                            name="englishRequirement.overallScore"
                                            label="Overall Score"
                                            as="input"
                                            type="number"
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <TextBox
                                            name="englishRequirement.minimumBand"
                                            label="Minimum Band"
                                            as="input"
                                            type="number"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">
                                            Tuition Fee
                                        </Typography>

                                        <TextBox
                                            name="tuitionFee"
                                            label=""
                                            as="input"
                                            type="number"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">
                                            Application Fee
                                        </Typography>

                                        <TextBox
                                            name="applicationFee"
                                            label=""
                                            as="input"
                                            type="number"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ArrayInput
                                            label="Specializations"
                                            value={values.specializations}
                                            setFieldValue={setFieldValue}
                                            fieldName="specializations"
                                            placeholder="AI, Cyber Security..."
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ArrayInput
                                            label="Intakes"
                                            value={values.intakes}
                                            setFieldValue={setFieldValue}
                                            fieldName="intakes"
                                            placeholder="January, May..."
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ArrayInput
                                            label="Entry Requirements"
                                            value={values.entryRequirements}
                                            setFieldValue={setFieldValue}
                                            fieldName="entryRequirements"
                                            placeholder="Requirement..."
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ArrayInput
                                            label="Career Opportunities"
                                            value={values.careerOpportunities}
                                            setFieldValue={setFieldValue}
                                            fieldName="careerOpportunities"
                                            placeholder="Software Engineer..."
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ArrayInput
                                            label="Features"
                                            value={values.features}
                                            setFieldValue={setFieldValue}
                                            fieldName="features"
                                            placeholder="Top Ranked, Internship..."
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
                                    Save Course
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

export default AddCourseModal;
