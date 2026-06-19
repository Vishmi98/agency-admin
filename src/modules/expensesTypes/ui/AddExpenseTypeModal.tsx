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
} from "@mui/material";
import { Formik, Form, FormikProps } from "formik";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { createExpensesTypeSliderData } from "../services/expenseTypes.services";
import { addDropdownInitialValues, addDropdownValidationSchema } from "../expensesTypes.utils";

import TextBox from "@/components/TextBox";
import { AddModalProps } from "@/modules/countries/countries.types";


const AddExpenseTypeModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();

    const handleSubmit = async (
        values: { title: string },
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            const response = await createExpensesTypeSliderData(values.title);
            if (response.success) {
                toast.success(response.message);
                handleReload();
                onClose();
                resetForm();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the expense type.");
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
                <DialogTitle
                    sx={{
                        padding: "16px 24px",
                        fontWeight: "bold",
                        color: theme.palette.text.primary,
                    }}
                >
                    Add New Expense Type
                </DialogTitle>
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
                                        <Typography fontSize="12px">Expense Type</Typography>
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
                                    onClick={onClose}
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

export default AddExpenseTypeModal;
