"use client"

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, useTheme, Box, Typography, Grid } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';

import { EditStudentModalProps, StudentType } from '../student.types';
import { getVisaStatuses, updateStudent } from '../services/student.services';
import { addStudentValidationSchema } from '../student.utils';

import { DropdownType } from '@/type/common.types';
import { getTitles } from '@/modules/staff/services/staff.services';
import TextBox from '@/components/TextBox';


const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, initialValues, reloadData }) => {
    const theme = useTheme();

    const [titles, setTitles] = useState<DropdownType[]>([]);
    const [visaStatuses, setVisaStatuses] = useState<DropdownType[]>([]);

    const fetchDropdownData = async () => {
        try {
            const [titlesData, visaStatusesData] = await Promise.all([
                getTitles(),
                getVisaStatuses(),
            ]);

            setTitles(titlesData.success ? titlesData.titles : []);
            setVisaStatuses(visaStatusesData.success ? visaStatusesData.visaStatusTypes : []);
        } catch (error) {
            // console.log("Error fetching dropdown data", error);
        }
    };

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const handleSubmit = async (
        values: StudentType,
        { resetForm }: FormikHelpers<StudentType>
    ) => {
        try {
            const response = await updateStudent(values.id, values);

            if (response.success) {
                toast.success(response.message || "Student updated successfully!");
                reloadData();
                resetForm();
                onClose();
            } else {
                toast.error(response.message || "Failed to update student.");
            }

        } catch (error) {
            toast.error("An error occurred while updating the student.");
            // console.log("Update Student Error:", error);
        }
    };

    if (!initialValues) return null;

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
                <DialogTitle
                    sx={{
                        padding: "16px 24px",
                        fontWeight: "bold",
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                        color: theme.palette.text.primary,
                        backgroundColor: "#fff"
                    }}
                >
                    Edit Student Details
                </DialogTitle>
                <Formik
                    initialValues={initialValues}
                    validationSchema={addStudentValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting }) => (
                        <Form>
                            <DialogContent>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        Personal Details
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Title</Typography>
                                            <Field
                                                as="select"
                                                name="title"
                                                className="border p-2 w-full"
                                            >
                                                <option value="">Select Title</option>
                                                {titles.map((title) => (
                                                    <option key={title.id} value={title.id}>
                                                        {title.title.EN}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="title" component="div" className="text-red-300 text-xs m-1" />
                                        </Grid>

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
                                            <Typography fontSize="12px">Full Name</Typography>
                                            <TextBox
                                                name="fullName"
                                                label=""
                                                as="input"
                                                type="text"
                                                fullWidth
                                                error={touched.fullName && !!errors.fullName}
                                                helperText={touched.fullName && errors.fullName}
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
                                            <Typography fontSize="12px">Address</Typography>
                                            <TextBox
                                                name="address"
                                                label=""
                                                as="input"
                                                type="text"
                                                fullWidth
                                                error={touched.address && !!errors.address}
                                                helperText={touched.address && errors.address}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">NIC</Typography>
                                            <TextBox
                                                name="nic"
                                                label=""
                                                as="input"
                                                type="text"
                                                fullWidth
                                                error={touched.nic && !!errors.nic}
                                                helperText={touched.nic && errors.nic}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginTop: '16px' }}>
                                        Passport Details
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Passport Number</Typography>
                                            <TextBox
                                                name="passportNo"
                                                label=""
                                                as="input"
                                                type="text"
                                                fullWidth
                                                error={touched.passportNo && !!errors.passportNo}
                                                helperText={touched.passportNo && errors.passportNo}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Visa Status</Typography>
                                            <Field
                                                as="select"
                                                name="visaStatus"
                                                className="border p-2 w-full"
                                            >
                                                <option value="">Select Visa Status</option>
                                                {visaStatuses.map((status) => (
                                                    <option key={status.id} value={status.id}>
                                                        {status.title["EN"]}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="visaStatus" component="div" className="text-red-300 text-xs m-1" />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Passport Issue Date</Typography>
                                            <TextBox
                                                name="issueDate"
                                                label=""
                                                as="input"
                                                type="date"
                                                fullWidth
                                                error={touched.issueDate && !!errors.issueDate}
                                                helperText={touched.issueDate && errors.issueDate}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Passport Expire Date</Typography>
                                            <TextBox
                                                name="expireDate"
                                                label=""
                                                as="input"
                                                type="date"
                                                fullWidth
                                                error={touched.expireDate && !!errors.expireDate}
                                                helperText={touched.expireDate && errors.expireDate}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Visa Issue Date</Typography>
                                            <TextBox
                                                name="visaIssueDate"
                                                label=""
                                                as="input"
                                                type="date"
                                                fullWidth
                                                error={touched.visaIssueDate && !!errors.visaIssueDate}
                                                helperText={touched.visaIssueDate && errors.visaIssueDate}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Visa Expire Date</Typography>
                                            <TextBox
                                                name="visaExpireDate"
                                                label=""
                                                as="input"
                                                type="date"
                                                fullWidth
                                                error={touched.visaExpireDate && !!errors.visaExpireDate}
                                                helperText={touched.visaExpireDate && errors.visaExpireDate}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </DialogContent>
                            <DialogActions
                                sx={{
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
                                    Update
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog >
            <ToastContainer />
        </>
    );
};

export default EditStudentModal;
