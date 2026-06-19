"use client";

import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
    useTheme,
} from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";

import { UserFormValues, UserType } from "../user.types";
import { addUserInitialValues, addUserValidationSchema } from "../user.utils";
import { createUser } from "../services/user.services";

import TextBox from "@/components/TextBox";


const AddUserModal = (props: UserFormValues) => {
    const { handleClose, open } = props;
    const theme = useTheme();

    const handleSubmit = async (values: UserType, actions: FormikHelpers<UserType>) => {
        try {
            const response = await createUser(values);
            if (response.success) {
                console.log('User added successfully:', response.data);
                handleClose();
                actions.resetForm();
                if (props.onUserAdded) {
                    props.onUserAdded();
                }
            } else {
                console.log('Failed to add user:', response.message);
            }
        } catch (error) {
            console.log('Error adding user:', error);
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
                    color: theme.palette.text.primary,
                    padding: "16px 24px 0 24px",
                    fontWeight: "bold",
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                }}
            >
                Add New User
            </DialogTitle>
            <Formik
                initialValues={addUserInitialValues}
                validationSchema={addUserValidationSchema}
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
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography fontSize="12px">First Name</Typography>
                                    <TextBox
                                        name="firstName"
                                        label=""
                                        as="input"
                                        type="text"
                                        fullWidth
                                        error={touched.firstName && !!errors.firstName}
                                        helperText={touched.firstName && errors.firstName}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography fontSize="12px">Last Name</Typography>
                                    <TextBox
                                        name="lastName"
                                        label=""
                                        as="input"
                                        type="text"
                                        fullWidth
                                        error={touched.lastName && !!errors.lastName}
                                        helperText={touched.lastName && errors.lastName}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography fontSize="12px">Email Address</Typography>
                                    <TextBox
                                        name="email"
                                        label=""
                                        as="input"
                                        type="email"
                                        fullWidth
                                        error={touched.email && !!errors.email}
                                        helperText={touched.email && errors.email}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography fontSize="12px">Phone Number</Typography>
                                    <TextBox
                                        name="phoneNumber"
                                        label=""
                                        as="input"
                                        type="text"
                                        fullWidth
                                        error={touched.phoneNumber && !!errors.phoneNumber}
                                        helperText={touched.phoneNumber && errors.phoneNumber}
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
        </Dialog >
    );
};

export default AddUserModal;
