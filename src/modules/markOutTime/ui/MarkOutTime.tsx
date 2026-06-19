"use client";

import React from "react";
import {
    Box,
    Button,
    Grid,
    Typography,
    useTheme,
} from "@mui/material";
import { Formik, Form, FormikProps, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import TextBox from "@/components/TextBox";
import { AttendanceFormValues, AttendanceMarkType } from "@/modules/attendanceMark/attendanceMarks.types";
import { addAttendance } from "@/modules/attendanceMark/services/attendanceMark.services";
import { addAttendanceMarkInitialValues, addAttendanceValidationSchema } from "@/modules/attendanceMark/attendanceMarks.utils";


const MarkOutTime = (props: AttendanceFormValues) => {

    const { handleReload, staffMembers } = props;

    const theme = useTheme();

    const handleSubmit = async (
        values: AttendanceMarkType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            const response = await addAttendance(values);
            if (response.success) {
                toast.success(response.message);
                handleReload();
                resetForm();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the attendance mark.");
            console.log(error);
        }
    };


    return (
        <>
            <Box sx={{ width: "100%" }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "bold",
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                        color: theme.palette.text.primary,
                        marginBottom: 1
                    }}
                >
                    Mark Out time
                </Typography>
                <Formik
                    initialValues={addAttendanceMarkInitialValues}
                    validationSchema={addAttendanceValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting, setFieldValue }: FormikProps<AttendanceMarkType>) => (
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
                                    <Grid item xs={12} md={5}>
                                        <Typography fontSize="12px">Staff ID</Typography>
                                        <Field
                                            as="select"
                                            name="staffId"
                                            className="border p-2 w-full"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                const selectedId = Number(e.target.value);
                                                setFieldValue('staffId', selectedId);
                                            }}
                                        >
                                            <option value="">Select Staff ID</option>
                                            {staffMembers.map((staff) => (
                                                <option key={staff.id} value={staff.id}>
                                                    {`${staff.firstName} ${staff.lastName} (${staff.id})`}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="staffId" component="div" className="text-red-400 text-xs mt-1.5 pl-2" />
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <Typography fontSize="12px">Out Time</Typography>
                                        <TextBox
                                            name="inTime"
                                            label=""
                                            as="input"
                                            type="time"
                                            fullWidth
                                            error={touched.inTime && !!errors.inTime}
                                            helperText={touched.inTime && errors.inTime}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2}>
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
                                                disabled={isSubmitting}
                                                sx={{
                                                    backgroundColor: "#1976d2",
                                                    borderRadius: "5px",
                                                    textTransform: "none",
                                                    "&:hover": { backgroundColor: "#115293" },
                                                    width: "100%"
                                                }}
                                            >
                                                Add
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </>
    );
};

export default MarkOutTime;
