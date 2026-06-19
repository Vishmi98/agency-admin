"use client";

import React, { FC, useState } from "react";
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
import { Formik, Form, FormikProps } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";

import { AwardType } from "../award.types";
import { createAward } from "../award.service";
import {
    addAwardInitialValues,
    addAwardValidationSchema,
} from "../award.utils";

import { AddModalProps } from "@/modules/countries/countries.types";
import TextBox from "@/components/TextBox";

const AddAwardModal: FC<AddModalProps> = ({
    isOpen,
    onClose,
    handleReload,
}) => {
    const theme = useTheme();

    const [documentImageFile, setDocumentImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Handle file change
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setDocumentImageFile(file);
        }
    };

    const handleSubmit = async (
        values: AwardType,
        {
            resetForm,
            setSubmitting,
        }: {
            resetForm: () => void;
            setSubmitting: (isSubmitting: boolean) => void;
        }
    ) => {
        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("year", values.year);
            formData.append("title", values.title);

            if (documentImageFile) {
                formData.append("images", documentImageFile);
            }

            const response = await createAward(formData);

            if (response.success) {
                toast.success(response.message);
                onClose();
                resetForm();
                setDocumentImageFile(null);
                handleReload();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while adding the award.");
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
                        Add New Award
                    </DialogTitle>
                    <CloseIcon data-testid="CloseIcon" sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
                </Box>

                <Formik
                    initialValues={addAwardInitialValues}
                    validationSchema={addAwardValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors, touched }: FormikProps<AwardType>) => (
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
                                    {/* YEAR */}
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">
                                            Year
                                        </Typography>

                                        <TextBox
                                            name="year"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.year && !!errors.year}
                                            helperText={touched.year && errors.year}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">
                                            Title
                                        </Typography>

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

                                    {/* IMAGE */}
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">
                                            Image
                                        </Typography>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </Grid>

                                    {/* PREVIEW */}
                                    {documentImageFile && (
                                        <Box sx={{ textAlign: "center", padding: 2 }}>
                                            <img
                                                src={URL.createObjectURL(
                                                    documentImageFile
                                                )}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: 250,
                                                    marginTop: 10,
                                                }}
                                            />
                                        </Box>
                                    )}
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
                                    disabled={isSubmitting || isLoading}
                                    sx={{
                                        backgroundColor: "#1976d2",
                                        borderRadius: "5px",
                                        textTransform: "none",
                                        "&:hover": { backgroundColor: "#115293" },
                                        width: "200px"
                                    }}
                                >
                                    {isSubmitting || isLoading ? (
                                        <CircularProgress size={18} />
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

export default AddAwardModal;