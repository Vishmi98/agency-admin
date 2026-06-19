"use client";

import React, { FC, useEffect, useState } from "react";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
    Grid, useTheme, Box, CircularProgress
} from "@mui/material";
import { Formik, Form, FormikProps } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";

import { SuccessStoryType } from "../successStory.types";
import { createSuccessStory } from "../services/successStory.service";
import { addSuccessStoryInitialValues, addSuccessStoryValidationSchema } from "../successStory.utils";

import { AddModalProps } from "@/modules/countries/countries.types";
import CropModal from "@/components/CropModal";


const AddSuccessStoryModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();
    const [documentImageFile, setDocumentImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        return () => {
            if (documentImageFile) URL.revokeObjectURL(documentImageFile as any);
        };
    }, [documentImageFile]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setCropModalOpen(true);
        }
    };

    const handleCropComplete = (croppedFile: File) => {
        setDocumentImageFile(croppedFile);
        setCropModalOpen(false);
    };

    const handleSubmit = async (
        values: SuccessStoryType,
        { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        try {
            setIsLoading(true);
            const formData = new FormData();

            // Append cropped file only (no other fields required)
            if (documentImageFile) formData.append("documentPath", documentImageFile);

            const response = await createSuccessStory(formData);

            if (response.success) {
                toast.success(response.message);
                onClose();
                resetForm();
                setDocumentImageFile(null);
                handleReload();
            } else {
                toast.error(response.message);
                onClose();
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while adding the success story.");
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <>
            <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs"
                PaperProps={{ sx: { borderRadius: 2, boxShadow: 3, bgcolor: theme.palette.background.paper } }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <DialogTitle sx={{ px: 3, py: 2, fontWeight: "bold" }}>Add New Success Story</DialogTitle>
                    <CloseIcon sx={{ cursor: "pointer", mr: 2 }} onClick={onClose} />
                </Box>

                <Formik
                    initialValues={addSuccessStoryInitialValues}
                    validationSchema={addSuccessStoryValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }: FormikProps<SuccessStoryType>) => (
                        <Form>
                            <DialogContent sx={{ px: 3, py: 2, maxHeight: 400, overflowY: "auto" }}>
                                <Grid item xs={12}>
                                    <Typography fontSize="12px">Image</Typography>
                                    <input type="file" accept="image/*" onChange={handleImageChange} />
                                </Grid>

                                <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
                                    {documentImageFile && (
                                        <img
                                            src={URL.createObjectURL(documentImageFile)}
                                            alt="Story"
                                            style={{ maxWidth: "100%", maxHeight: 250, marginTop: 10, borderRadius: 8 }}
                                        />
                                    )}
                                </Box>
                            </DialogContent>

                            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                                <Button onClick={onClose} color="secondary" variant="outlined" sx={{ width: 150, textTransform: "none" }}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary"
                                    disabled={isSubmitting || isLoading} sx={{ width: 150, textTransform: "none" }}>
                                    {isSubmitting || isLoading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Add"}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {selectedFile && cropModalOpen && (
                <CropModal
                    imageFile={selectedFile}
                    onCropComplete={handleCropComplete}
                    onClose={() => setCropModalOpen(false)}
                    cropWidth={450}
                    cropHeight={620}
                />
            )}

            <ToastContainer />
        </>
    );
};

export default AddSuccessStoryModal;
