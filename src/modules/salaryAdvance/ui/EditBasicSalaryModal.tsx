"use client"

import React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, useTheme, Box, Typography, Grid } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';

import { BasicSalaryType, EditBasicSalaryModalProps } from '../salaryAdvance.types';
import { updateBasicSalary } from '../service/salaryAdvance.service';
import { addBasicSalaryValidationSchema } from '../salaryAdvance.utils';

import TextBox from '@/components/TextBox';


const EditBasicSalaryModal: React.FC<EditBasicSalaryModalProps> = ({ isOpen, onClose, initialValues, reloadData }) => {
    const theme = useTheme();
    
    const handleSubmit = async (
        values: BasicSalaryType,
        { resetForm }: FormikHelpers<BasicSalaryType>
    ) => {
        try {
            const response = await updateBasicSalary(values);

            if (response.success) {
                toast.success(response.message);
                reloadData();
                resetForm();
                onClose();
            } else {
                toast.error(response.message);
            }

        } catch (error) {
            toast.error("An error occurred while updating the basic salary.");
        }
    };

    if (!initialValues) return null;

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
                        Edit Basic Salary Details
                    </DialogTitle>
                    <CloseIcon data-testid="CloseIcon" sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
                </Box>
                <Formik
                    initialValues={initialValues}
                    validationSchema={addBasicSalaryValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting }) => (
                        <Form>
                            <DialogContent>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography fontSize="12px">Role</Typography>
                                            <TextBox
                                                name="role"
                                                label=""
                                                as="input"
                                                type="number"
                                                fullWidth
                                                error={touched.role && !!errors.role}
                                                helperText={touched.role && errors.role}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography fontSize="12px">Role Name</Typography>
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
                                        <Grid item xs={12}>
                                            <Typography fontSize="12px">Amount</Typography>
                                            <TextBox
                                                name="basicSalary"
                                                label=""
                                                as="input"
                                                type="number"
                                                fullWidth
                                                error={touched.basicSalary && !!errors.basicSalary}
                                                helperText={touched.basicSalary && errors.basicSalary}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </DialogContent>
                            <DialogActions
                                sx={{
                                    gap: "8px",
                                    position: "sticky",
                                    bottom: 0,
                                    backgroundColor: theme.palette.background.paper,
                                    zIndex: 1000,
                                    p: 3
                                }}
                            >
                                <Button
                                    color="secondary"
                                    sx={{
                                        backgroundColor: "#f5f5f5",
                                        color: "#555",
                                        borderRadius: "5px",
                                        textTransform: "none",
                                        "&:hover": { backgroundColor: "#e0e0e0" },
                                        width: "100%"
                                    }}
                                    onClick={onClose}
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
                                        width: "100%"
                                    }}
                                >
                                    Update
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog >
            <ToastContainer />
        </>
    );
};

export default EditBasicSalaryModal;
