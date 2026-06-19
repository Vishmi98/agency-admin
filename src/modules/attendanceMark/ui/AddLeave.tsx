"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { AddLeaveFormValues, AddLeaveType } from "../attendanceMarks.types";
import { addLeaveInitialValues, addLeaveValidationSchema } from "../attendanceMarks.utils";
import { addLeave, getLeaveTypes } from "../services/attendanceMark.services";

import { DropdownType } from "@/type/common.types";
import TextBox from "@/components/TextBox";


const AddLeave = (props: AddLeaveFormValues) => {
    const { handleReload, staffMembers } = props;

    const theme = useTheme();
    const [leaveTypes, setLeaveTypes] = useState<DropdownType[]>([]);

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const fetchLeaveTypes = async () => {
        try {
            const response = await getLeaveTypes();
            if (response.success) {
                setLeaveTypes(response.leaveTypes);
            } else {
                toast.error(response.message || "Failed to fetch leaves data");
            }
        } catch (error) {
            toast.error("Error fetching leaves data");
        }
    };

    const handleSubmit = async (
        values: AddLeaveType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            const response = await addLeave(values.date, Number(values.staffId), Number(values.leave));
            if (response.success) {
                toast.success(response.message);
                resetForm();
                handleReload();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the leave.");
            console.log(error);
        }
    };

    return (
        <>
            <Box sx={{ width: "100%", backgroundColor: '#fff', borderRadius: "5px", padding: 1 }}>
                <Formik
                    initialValues={addLeaveInitialValues}
                    validationSchema={addLeaveValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form>
                            <Grid container spacing={2} marginTop={-2.5}>
                                {/* Staff Select */}
                                <Grid item xs={12} md={6} lg={4} >
                                    <Typography fontSize="12px">Staff</Typography>
                                    <Field
                                        as="select"
                                        name="staffId"
                                        className="border p-2 w-full"
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                            setFieldValue("staffId", Number(e.target.value))
                                        }
                                    >
                                        <option value="">Select Staff</option>
                                        {staffMembers.map((staff) => (
                                            <option key={staff.id} value={staff.id}>
                                                {`${staff.firstName} ${staff.lastName} (${staff.id})`}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="staffId" component="div" className="text-red-600 text-xs" />
                                </Grid>

                                {/* Leave Type */}
                                <Grid item xs={12} md={6} lg={4} >
                                    <Typography fontSize="12px">Leave Type</Typography>
                                    <Field
                                        as="select"
                                        name="leave"
                                        className="border p-2 w-full"
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                            setFieldValue("leave", Number(e.target.value))
                                        }
                                    >
                                        <option value="">Select Leave Type</option>
                                        {leaveTypes.map((leave) => (
                                            <option key={leave.id} value={leave.id}>
                                                {leave.title["EN"]}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="leave" component="div" className="text-red-600 text-xs" />
                                </Grid>

                                {/* Date Picker */}
                                <Grid item xs={12} md={6} lg={4} >
                                    <Typography fontSize="12px">Date</Typography>
                                    <TextBox
                                        label=""
                                        as={TextField}
                                        type="date"
                                        name="date"
                                        fullWidth
                                    />
                                    <ErrorMessage name="date" component="div" className="text-red-600 text-xs" />
                                </Grid>
                            </Grid>
                            <Box
                                sx={{
                                    gap: "8px",
                                    marginTop: 2,
                                    backgroundColor: theme.palette.background.paper,
                                    display: "flex",
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    sx={{
                                        borderRadius: "5px",
                                        textTransform: "none",
                                        width: "200px",
                                    }}
                                >
                                    Add
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </>
    );
};

export default AddLeave;
