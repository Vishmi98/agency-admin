"use client";

import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Formik, Form, FormikProps, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';

import { AddLeaveModalPropType, AttendanceMarkType } from "../attendanceMarks.types";
import { addAttendanceMarkInitialValues, addLeaveValidationSchema } from "../attendanceMarks.utils";
import { createLeave, getLeaveTypes } from "../services/attendanceMark.services";

import { DropdownType } from "@/type/common.types";


const AddLeaveModal = (props: AddLeaveModalPropType) => {
    const { handleClose, open, handleReload, staffMembers } = props;

    const theme = useTheme();
    const [leaveTypes, setLeaveTypes] = useState<DropdownType[]>([]);

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

    useEffect(() => {

        if (open) {
            fetchLeaveTypes();
        }
    }, [open]);

    const handleSubmit = async (
        values: AttendanceMarkType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            const response = await createLeave(values);
            if (response.success) {
                toast.success(response.message);
                handleReload();
                handleClose();
                resetForm();
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
                        Add New Leave
                    </DialogTitle>
                    <Box
                        onClick={handleClose}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            width: 32,
                            height: 32,
                            marginRight: 2,
                        }}
                    >
                        <CloseIcon sx={{ width: 18, height: 18 }} />
                    </Box>
                </Box>
                <Formik
                    initialValues={addAttendanceMarkInitialValues}
                    validationSchema={addLeaveValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue }: FormikProps<AttendanceMarkType>) => (
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
                                    <Grid item xs={12} md={6}>
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
                                        <ErrorMessage name="staffId" component="div" className="text-red-600 text-xs" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Leave Type</Typography>
                                        <Field
                                            as="select"
                                            name="leave"
                                            className="border p-2 w-full"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                const selectedId = Number(e.target.value);
                                                setFieldValue('leave', selectedId);
                                            }}
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
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
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
        </>
    );
};

export default AddLeaveModal;
