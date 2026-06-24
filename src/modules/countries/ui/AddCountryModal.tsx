"use client"

import React, { FC } from "react";
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
} from "@mui/material";
import { Formik, Form, FormikProps } from "formik";
import { toast, ToastContainer } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';

import { AddModalProps } from "../countries.types";
import { createCountrySliderData } from "../services/countries.services";

import TextBox from "@/components/TextBox";
import { addDropdownInitialValues, addDropdownValidationSchema } from "@/modules/expensesTypes/expensesTypes.utils";
import { getCookieUser } from "@/utils/cookie.util";
import { logActivity } from "@/utils/logActivity";


const AddCountryModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();
    const user = getCookieUser();

    const handleSubmit = async (
        values: { title: string },
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            const response = await createCountrySliderData(values.title);
            if (response.success) {
                toast.success(response.message);

                if (user) {
                    logActivity({
                        userId: user.id,
                        action: "COUNTRY_CREATED_SUCCESS",
                        path: "/modules/countries/ui/AddCountryModal",
                        endpoint: "/api/country/create",
                        method: "POST",
                        meta: {
                            country: values.title,
                        }
                    });
                }

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
                    initialValues={addDropdownInitialValues}
                    validationSchema={addDropdownValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {(formik: FormikProps<{ title: string }>) => (
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
                                            name="title"
                                            as={TextField}
                                            type="text"
                                            label=""
                                            fullWidth
                                            error={formik.touched.title && !!formik.errors.title}
                                            helperText={formik.touched.title && formik.errors.title}
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
                                    onClick={() => {
                                        onClose();

                                        if (user) {
                                            logActivity({
                                                userId: user.id,
                                                action: "ADD_COUNTRY_CANCEL",
                                                path: "/modules/countries/ui/AddCountryModal",
                                                method: "CLIENT",
                                            });
                                        }
                                    }}
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

export default AddCountryModal;
