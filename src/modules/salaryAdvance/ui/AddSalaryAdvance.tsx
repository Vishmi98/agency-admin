"use client";

import React, { useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { Formik, Form, FormikProps, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { SalaryAdvanceFormValues, SalaryAdvanceType } from "../salaryAdvance.types";
import { addSalaryAdvance } from "../service/salaryAdvance.service";
import { addSalaryAdvanceInitialValues, addSalaryAdvanceValidationSchema } from "../salaryAdvance.utils";

import TextBox from "@/components/TextBox";
import { getTodayDate } from "@/modules/attendances/attendance.utils";


const AddSalaryAdvance = (props: SalaryAdvanceFormValues) => {
    const { handleReload, staffMembers } = props;
    const [isLoading, setIsLoading] = useState(false);

    const theme = useTheme();

    const handleSubmit = async (
        values: SalaryAdvanceType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            setIsLoading(true);
            const response = await addSalaryAdvance(values);
            if (response.success) {
                toast.success(response.message);
                resetForm();
                handleReload();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the salary advance");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Box sx={{ width: "100%", marginTop: -1 }}>
                <Formik
                    initialValues={{
                        ...addSalaryAdvanceInitialValues,
                        date: getTodayDate()
                    }}
                    validationSchema={addSalaryAdvanceValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        touched,
                        errors,
                        setFieldValue,
                    }: FormikProps<SalaryAdvanceType>) => {
                        return (
                            <Form>
                                <Box
                                    sx={{
                                        maxHeight: "400px",
                                        overflowY: "auto",
                                        backgroundColor: theme.palette.background.paper,
                                        width: "100%"
                                    }}
                                >
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Staff ID</Typography>
                                            <Autocomplete
                                                options={staffMembers}
                                                getOptionLabel={(option) => option.fullName}
                                                loading={isLoading}
                                                onChange={async (event, value) => {
                                                    const staffId = value ? value.id : '';
                                                    setFieldValue('staffId', staffId);
                                                }}
                                                size="small"
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder="Search..."
                                                        fullWidth
                                                        error={touched.staffId && Boolean(errors.staffId)}
                                                        helperText={touched.staffId && errors.staffId}
                                                    />
                                                )}
                                            />
                                            <ErrorMessage name="staffId" component="div" className="text-red-400 text-xs mt-1.5 pl-2" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Date</Typography>
                                            <Field
                                                name="date"
                                                type="date"
                                                as="input"
                                                disabled
                                                fullWidth
                                                className="border p-1.5 w-full rounded-[5px]"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
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

                                    <Box
                                        sx={{
                                            position: "sticky",
                                            bottom: 0,
                                            backgroundColor: theme.palette.background.paper,
                                            zIndex: 1000,
                                            width: "100%",
                                            marginTop: 2.5
                                        }}
                                    >
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isLoading}
                                            sx={{
                                                backgroundColor: "#1976d2",
                                                borderRadius: "5px",
                                                textTransform: "none",
                                                "&:hover": { backgroundColor: "#115293" },
                                                width: "20%"
                                            }}
                                        >
                                            {isLoading ? "Adding..." : "Add"}
                                        </Button>
                                    </Box>
                                </Box>
                            </Form>
                        );
                    }}
                </Formik>
            </Box>
        </>
    );
};

export default AddSalaryAdvance;
