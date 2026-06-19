"use client";

import React, { useEffect, useState } from "react";
import {
    Autocomplete,
    Button,
    DialogActions,
    DialogContent,
    Grid,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { Formik, Form, ErrorMessage } from "formik";

import { addInvoiceInitialValues, addInvoiceValidationSchema } from "../invoice.utils";

import { StudentDataType } from "@/modules/student/student.types";
import { getStudentData } from "@/modules/student/services/student.services";


const Testing = () => {
    const theme = useTheme();
    const [students, setStudents] = useState<StudentDataType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        const response = await getStudentData(1, 10); // Fetch first 10 students
        if (response.success) {
            setStudents(response.students);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {
        console.log("done");
    };

    return (
        <Formik
            initialValues={addInvoiceInitialValues}
            validationSchema={addInvoiceValidationSchema}
            onSubmit={handleSubmit}
        >
            {({ touched, errors, isSubmitting, setFieldValue }) => (
                <Form>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={4}>
                                <Typography fontSize="12px">Select Student</Typography>
                                <Autocomplete
                                    options={students}
                                    getOptionLabel={(option) => option.fullName}
                                    loading={isLoading}
                                    onChange={(event, value) => {
                                        setFieldValue('studentId', value ? value.id : '');
                                    }}
                                    size="small"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            placeholder="Search Student..."
                                            fullWidth
                                            error={touched.studentId && Boolean(errors.studentId)}
                                            helperText={touched.studentId && errors.studentId}
                                        />
                                    )}
                                />
                                <ErrorMessage name="studentId" component="div" className="text-red-400 text-xs pl-2 pt-2" />
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
                            Create Invoice
                        </Button>
                    </DialogActions>
                </Form>
            )}
        </Formik>
    );
};

export default Testing;
