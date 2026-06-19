"use client";

import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
    useTheme,
} from '@mui/material';
import { Formik, Form, FormikHelpers } from 'formik';

import { PromotionFormValues, PromotionType } from '../promotion.types';
import { createPromotion } from '../services/promotion.services';
import { addPromotionInitialValues, addPromotionValidationSchema } from '../promotion.utils';

import TextBox from '@/components/TextBox';


const AddPromotionModal = (props: PromotionFormValues) => {
    const { handleClose, open } = props;
    
    const theme = useTheme();

    const handleSubmit = async (values: PromotionType, actions: FormikHelpers<PromotionType>) => {
        try {
            const response = await createPromotion(values);
            if (response.success) {
                console.log('Promotion added successfully:', response.data);
                handleClose();
                actions.resetForm();
                if (props.onPromotionAdded) {
                    props.onPromotionAdded();
                }
            } else {
                console.log('Failed to add promotion:', response.message);
            }
        } catch (error) {
            console.log('Error adding promotion:', error);
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
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
                Add New Promotion
            </DialogTitle>
            <Formik
                initialValues={addPromotionInitialValues}
                validationSchema={addPromotionValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ touched, errors, isSubmitting }) => (
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
                                <Grid item xs={12}>
                                    <Typography fontSize="12px">Description</Typography>
                                    <TextBox
                                        name="description"
                                        label=""
                                        as="textarea"
                                        type="text"
                                        multiline
                                        rows={3}
                                        fullWidth
                                        error={touched.description && !!errors.description}
                                        helperText={touched.description && errors.description}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography fontSize="12px">Amount</Typography>
                                    <TextBox
                                        name="amount"
                                        label=""
                                        as="input"
                                        type="number"
                                        fullWidth
                                        error={touched.amount && !!errors.amount}
                                        helperText={touched.amount && errors.amount}
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
                                onClick={handleClose}
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
    );
};

export default AddPromotionModal;
