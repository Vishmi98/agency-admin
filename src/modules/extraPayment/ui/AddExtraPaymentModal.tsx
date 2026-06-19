"use client";

import React, { FC } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
    useTheme,
} from '@mui/material';
import { Formik, Form, FormikProps } from 'formik';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';

import { createExtraPayment } from '../services/extraPayment.services';
import { addExtraPaymentInitialValues, addExtraPaymentValidationSchema } from '../extraPayment.utils';
import { bodyType, ExtraPaymentType } from '../extraPayment.types';

import TextBox from '@/components/TextBox';
import { AddModalProps } from '@/modules/countries/countries.types';


const AddExtraPaymentModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();

    const handleSubmit = async (
        values: ExtraPaymentType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            const formattedValues: bodyType = {
                title: {
                    SN: values.title,
                    EN: values.title,
                    TM: values.title,
                },
                amount: values.amount,
                currency: values.currency,
            };

            const response = await createExtraPayment(formattedValues);

            if (response.success) {
                toast.success(response.message);
                handleReload();
                onClose();
                resetForm();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the extra payment.");
            console.log(error);
        }
    };

    return (
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
                    Add New Extra Payment
                </DialogTitle>
                <CloseIcon sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
            </Box>
            <Formik
                initialValues={addExtraPaymentInitialValues}
                validationSchema={addExtraPaymentValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ touched, errors, isSubmitting }: FormikProps<ExtraPaymentType>) => (
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
                                <Grid item xs={12}>
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
                                Save Extra Payments
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default AddExtraPaymentModal;
