"use client"

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
    TextField,
    Box,
    FormControl,
    Select,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import { Formik, Form, FormikProps } from "formik";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';

import { AddModalProps, WebCountryType } from "../countries.types";
import { createWebCountry } from "../services/countries.services";
import { addWebCountryInitialValues, addWebCountryValidationSchema } from "../countries.utils";

import TextBox from "@/components/TextBox";
import { WebUniversityDataType } from "@/modules/university/university.types";
import { getWebUniversities } from "@/modules/university/services/university.services";


const AddWebCountryModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();
    const [universities, setUniversities] = useState<WebUniversityDataType[]>([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await getWebUniversities(1, 100);
                if (response.success) {
                    setUniversities(response.universities);
                } else {
                    toast.error(response.message || "Failed to fetch universities");
                }
            } catch (error) {
                toast.error("Error fetching universities");
            }
        };

        if (isOpen) {
            fetchCountries();
        }
    }, [isOpen]);

    const handleSubmit = async (
        values: WebCountryType,
        { resetForm }: { resetForm: () => void }
    ) => {
        console.log("val", values);

        try {
            const response = await createWebCountry(values);
            if (response.success) {
                toast.success(response.message);
                handleReload();
                onClose();
                resetForm();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the country.");
            console.log(error);
        }
    };

    return (
        <>
            <Dialog
                open={isOpen}
                onClose={onClose}
                fullWidth
                maxWidth="xs"
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
                        Add New Country
                    </DialogTitle>
                    <CloseIcon sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
                </Box>
                <Formik
                    initialValues={addWebCountryInitialValues}
                    validationSchema={addWebCountryValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, setFieldValue, values }: FormikProps<WebCountryType>) => (
                        <Form>
                            <DialogContent
                                sx={{
                                    padding: "10px 24px",
                                    maxHeight: "400px",
                                    overflowY: "auto",
                                    backgroundColor: theme.palette.background.paper,
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Country Name</Typography>
                                        <TextBox
                                            name="country"
                                            as={TextField}
                                            type="text"
                                            label=""
                                            fullWidth
                                            error={touched.country && !!errors.country}
                                            helperText={touched.country && errors.country}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Image URL</Typography>
                                        <TextBox
                                            name="image"
                                            as={TextField}
                                            type="text"
                                            label=""
                                            fullWidth
                                            error={touched.image && !!errors.image}
                                            helperText={touched.image && errors.image}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Title</Typography>
                                        <TextBox
                                            name="title"
                                            as={TextField}
                                            type="text"
                                            label=""
                                            fullWidth
                                            error={touched.title && !!errors.title}
                                            helperText={touched.title && errors.title}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Short Description</Typography>
                                        <TextBox
                                            name="shortDescription"
                                            as={TextField}
                                            type="text"
                                            label=""
                                            fullWidth
                                            error={touched.shortDescription && !!errors.shortDescription}
                                            helperText={touched.shortDescription && errors.shortDescription}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Popularity</Typography>
                                        <TextBox
                                            name="popularity"
                                            as={TextField}
                                            type="text"
                                            label=""
                                            fullWidth
                                            error={touched.popularity && !!errors.popularity}
                                            helperText={touched.popularity && errors.popularity}
                                        />
                                    </Grid>

                                    {/* Advantages */}
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Grid item xs={12} sm={6} key={`advantage${i}`}>
                                            <Typography fontSize="12px">{`Advantage ${i}`}</Typography>
                                            <TextBox
                                                name={`advantage${i}` as keyof WebCountryType}
                                                as={TextField}
                                                type="text"
                                                label=""
                                                fullWidth
                                            />
                                        </Grid>
                                    ))}

                                    {/* Requirements */}
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Grid item xs={12} sm={6} key={`requirement${i}`}>
                                            <Typography fontSize="12px">{`Requirement ${i}`}</Typography>
                                            <TextBox
                                                name={`requirement${i}` as keyof WebCountryType}
                                                as={TextField}
                                                type="text"
                                                label=""
                                                fullWidth
                                            />
                                        </Grid>
                                    ))}

                                    {/* Costs */}
                                    {[1, 2, 3, 4].map((i) => (
                                        <Grid item xs={12} sm={6} key={`cost${i}`}>
                                            <Typography fontSize="12px">{`Cost ${i}`}</Typography>
                                            <TextBox
                                                name={`cost${i}` as keyof WebCountryType}
                                                as={TextField}
                                                type="text"
                                                label=""
                                                fullWidth
                                            />
                                        </Grid>
                                    ))}

                                    {/* Scholarships */}
                                    {[1, 2, 3, 4].map((i) => (
                                        <Grid item xs={12} sm={6} key={`scholarships${i}`}>
                                            <Typography fontSize="12px">{`Scholarship ${i}`}</Typography>
                                            <TextBox
                                                name={`scholarships${i}` as keyof WebCountryType}
                                                as={TextField}
                                                type="text"
                                                label=""
                                                fullWidth
                                            />
                                        </Grid>
                                    ))}

                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Select Universities</Typography>
                                        <FormControl fullWidth error={touched.universities && !!errors.universities}>
                                            <Select
                                                size="small"
                                                multiple
                                                value={values.universities}
                                                onChange={(event) => setFieldValue("universities", event.target.value)}
                                                renderValue={(selected: number[]) =>
                                                    selected
                                                        .map((id) => universities.find((u) => u.id === id)?.name)
                                                        .join(", ")
                                                }
                                            >
                                                {universities.map((uni) => (
                                                    <MenuItem key={uni.id} value={uni.id}>
                                                        {uni.id} {uni.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>
                                                {touched.universities && (errors.universities as string)}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">URL</Typography>
                                        <TextBox
                                            name="url"
                                            as={TextField}
                                            type="text"
                                            label=""
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
                                    backgroundColor: theme.palette.background.paper,
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
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        backgroundColor: "#1976d2",
                                        borderRadius: "5px",
                                        textTransform: "none",
                                        "&:hover": { backgroundColor: "#115293" },
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

export default AddWebCountryModal;
