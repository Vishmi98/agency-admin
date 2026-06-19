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
    CircularProgress,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';

import { WebUniversityType } from "../university.types";
import { createWebUniversity } from "../services/university.services";
import { addWebUniversityInitialValues, addWebUniversityValidationSchema } from "../university.utils";

import TextBox from "@/components/TextBox";
import { AddModalProps, WebCountryDataType } from "@/modules/countries/countries.types";
import { getWebCountriesData } from "@/modules/countries/services/countries.services";


const AddWebUniversityModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();

    const [countries, setCountries] = useState<WebCountryDataType[]>([]);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (coverImageFile) URL.revokeObjectURL(coverImageFile as any);
            if (logoFile) URL.revokeObjectURL(logoFile as any);
            imageFiles.forEach(file => URL.revokeObjectURL(file as any));
        };
    }, [coverImageFile, logoFile, imageFiles]);

    const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setCoverImageFile(file);
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setLogoFile(file);
    };

    const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files).slice(0, 3); // Max 3 images
            setImageFiles(fileArray);
        }
    };

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await getWebCountriesData();
                if (response.success) {
                    setCountries(response.countries);
                } else {
                    toast.error(response.message || "Failed to fetch countries");
                }
            } catch (error) {
                toast.error("Error fetching countries");
            }
        };

        if (isOpen) {
            fetchCountries();
        }
    }, [isOpen]);

    const handleSubmit = async (
        values: WebUniversityType,
        { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        try {
            setIsLoading(true);

            const formData = new FormData();

            // Append only non-file fields
            for (const key in values) {
                formData.append(key, String(values[key as keyof WebUniversityType]));
            }

            // Append files separately
            if (coverImageFile) formData.append("coverImage", coverImageFile);
            if (logoFile) formData.append("logo", logoFile);
            imageFiles.forEach((file) => {
                formData.append("images", file);
            });

            const response = await createWebUniversity(formData);

            if (response.success) {
                toast.success(response.message);

                resetForm();
                setCoverImageFile(null);
                setLogoFile(null);
                setImageFiles([]);
                handleReload();
                onClose();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the university.");
            console.log(error);
        } finally {
            setIsLoading(false);
            setSubmitting(false);
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
                        Add New University
                    </DialogTitle>
                    <CloseIcon data-testid="CloseIcon" sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
                </Box>
                <Formik
                    initialValues={addWebUniversityInitialValues}
                    validationSchema={addWebUniversityValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting, setFieldValue }: FormikProps<WebUniversityType>) => (
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
                                        <Typography fontSize="12px">University Name</Typography>
                                        <TextBox
                                            name="name"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.name && !!errors.name}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Short Code</Typography>
                                        <TextBox
                                            name="code"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.code && !!errors.code}
                                            helperText={touched.code && errors.code}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Phone Number</Typography>
                                        <TextBox
                                            name="phone"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.phone && !!errors.phone}
                                            helperText={touched.phone && errors.phone}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Email Address</Typography>
                                        <TextBox
                                            name="email"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.email && !!errors.email}
                                            helperText={touched.email && errors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Address</Typography>
                                        <TextBox
                                            name="address"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.address && !!errors.address}
                                            helperText={touched.address && errors.address}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">City</Typography>
                                        <TextBox
                                            name="city"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.city && !!errors.city}
                                            helperText={touched.city && errors.city}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Country</Typography>
                                        <Field
                                            as="select"
                                            name="countryId"
                                            className="border p-2 w-full rounded-md border-gray-300"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                const selectedId = Number(e.target.value);
                                                setFieldValue('countryId', selectedId);
                                            }}
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map((country) => (
                                                <option key={country.id} value={country.id}>
                                                    {country.country}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="countryId" component="div" className="text-red-300 text-xs ml-3 mt-2" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">International Student Count</Typography>
                                        <TextBox
                                            name="internationalStudentCount"
                                            label=""
                                            as="input"
                                            type="number"
                                            fullWidth
                                            error={touched.internationalStudentCount && !!errors.internationalStudentCount}
                                            helperText={touched.internationalStudentCount && errors.internationalStudentCount}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Living Cost (per month)</Typography>
                                        <TextBox
                                            name="livingCost"
                                            label=""
                                            as="input"
                                            type="number"
                                            fullWidth
                                            error={touched.livingCost && !!errors.livingCost}
                                            helperText={touched.livingCost && errors.livingCost}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Currency</Typography>
                                        <TextBox
                                            name="currency"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.currency && !!errors.currency}
                                            helperText={touched.currency && errors.currency}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Local Ranking</Typography>
                                        <TextBox
                                            name="localRanking"
                                            label=""
                                            as="input"
                                            type="number"
                                            fullWidth
                                            error={touched.localRanking && !!errors.localRanking}
                                            helperText={touched.localRanking && errors.localRanking}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">World Ranking</Typography>
                                        <TextBox
                                            name="worldRanking"
                                            label=""
                                            as="input"
                                            type="number"
                                            fullWidth
                                            error={touched.worldRanking && !!errors.worldRanking}
                                            helperText={touched.worldRanking && errors.worldRanking}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">University Website</Typography>
                                        <TextBox
                                            name="universityWebsite"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.universityWebsite && !!errors.universityWebsite}
                                            helperText={touched.universityWebsite && errors.universityWebsite}
                                        />
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
                                        <Typography fontSize="12px">Url</Typography>
                                        <TextBox
                                            name="url"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.url && !!errors.url}
                                            helperText={touched.url && errors.url}
                                        />
                                    </Grid>

                                    {/* --- Cover Image --- */}
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Cover Image</Typography>
                                        <input type="file" accept="image/*" onChange={handleCoverImageChange} />
                                        {coverImageFile && <img src={URL.createObjectURL(coverImageFile)} alt="Cover" style={{ maxWidth: "100%", maxHeight: "200px", marginTop: 10, borderRadius: 8 }} />}
                                    </Grid>

                                    {/* --- Logo --- */}
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Logo</Typography>
                                        <input type="file" accept="image/*" onChange={handleLogoChange} />
                                        {logoFile && <img src={URL.createObjectURL(logoFile)} alt="Logo" style={{ maxWidth: "100%", maxHeight: "200px", marginTop: 10, borderRadius: 8 }} />}
                                    </Grid>

                                    {/* --- Additional Images --- */}
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Additional Images (Max 3)</Typography>
                                        <input type="file" accept="image/*" multiple onChange={handleImagesChange} />
                                        <Box display="flex" gap={1} mt={1}>
                                            {imageFiles.map((file, index) => (
                                                <img key={index} src={URL.createObjectURL(file)} alt={`Image ${index + 1}`} style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px" }} />
                                            ))}
                                        </Box>
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
                                    {isSubmitting || isLoading ? (
                                        <>
                                            <CircularProgress size={18} sx={{ color: "#fff" }} />
                                        </>
                                    ) : (
                                        "Add"
                                    )}
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

export default AddWebUniversityModal;
