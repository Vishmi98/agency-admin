"use client";

import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
} from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import { toast } from "react-toastify";

import { ModalProps } from "../salary.types";
import { addBasicSalary } from "../services/salary.service";

import { StaffType } from "@/modules/staff/staff.types";
import TextBox from "@/components/TextBox";


const AddBasicSalaryModal: React.FC<ModalProps> = ({
    open,
    onClose,
    reloadData,
    initialValues,
}) => {

    const handleSubmit = async (
        values: StaffType,
        { resetForm }: FormikHelpers<StaffType>
    ) => {
        try {
            const response = await addBasicSalary(values.id, values.basicSalary);

            if (response.success) {
                toast.success(response.message || "Basic salary added successfully!");
                reloadData();
                resetForm();
                onClose();
            } else {
                toast.error(response.message || "Failed to add basic salary.");
            }
        } catch (error) {
            toast.error("An error occurred while adding basic salary.");
        }
    };

    if (!initialValues) return null;

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    style: {
                        borderRadius: "10px",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
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
                        backgroundColor: "#fff"
                    }}
                >
                    Add Basic Salary
                </DialogTitle>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting }) => (
                        <Form>
                            <DialogContent>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Basic Salary</Typography>
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
                            </DialogContent>
                            <DialogActions
                                sx={{
                                    gap: "8px",
                                    position: "sticky",
                                    bottom: 0,
                                    zIndex: 1000,
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
                                        width: "200px"
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
        </>
    );
};

export default AddBasicSalaryModal;
