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
    Autocomplete,
    TextField,
} from "@mui/material";
import { Formik, Form, ErrorMessage, FormikProps } from "formik";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';

import { CallCenterCallType } from "../callCenter.types";
import { createCall } from "../services/callCenter.service";
import { addCallCenterCallValidationSchema, addCallInitialValues } from "../callCenterCall.utils";

import TextBox from "@/components/TextBox";
import { AddModalProps } from "@/modules/countries/countries.types";
import { getCookieUser } from "@/utils/cookie.util";


const AddCallModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();

    const user = getCookieUser();

    const handleSubmit = async (
        values: CallCenterCallType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            values.createBy = user && user.id ? Number(user.id) : 0;

            const response = await createCall(values);
            if (response.success) {
                toast.success(response.message);
                handleReload();
                onClose();
                resetForm();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the call record.");
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
                        Add New Record
                    </DialogTitle>
                    <CloseIcon data-testid="CloseIcon" sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
                </Box>
                <Formik
                    initialValues={addCallInitialValues}
                    validationSchema={addCallCenterCallValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting, setFieldValue }: FormikProps<CallCenterCallType>) => (
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
                                        <Typography fontSize="12px">Name</Typography>
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
                                        <Typography fontSize="12px">From</Typography>
                                        <TextBox
                                            name="from"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.from && !!errors.from}
                                            helperText={touched.from && errors.from}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Qualification</Typography>
                                        <TextBox
                                            name="qualification"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.qualification && !!errors.qualification}
                                            helperText={touched.qualification && errors.qualification}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Success Percentage</Typography>
                                        <TextBox
                                            name="successPercentage"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.successPercentage && !!errors.successPercentage}
                                            helperText={touched.successPercentage && errors.successPercentage}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Note</Typography>
                                        <TextBox
                                            name="note"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={3}
                                            error={touched.note && !!errors.note}
                                            helperText={touched.note && errors.note}
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

export default AddCallModal;
