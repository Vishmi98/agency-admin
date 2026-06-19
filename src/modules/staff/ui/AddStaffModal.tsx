"use client";

import React, { FC, useEffect, useState } from "react";
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
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';

import { StaffType } from "../staff.types";
import { addStaffInitialValues, addStaffValidationSchema } from "../staff.utils";
import { createStaff, getBranches, getGenders, getTitles } from "../services/staff.services";

import { DropdownType } from "@/type/common.types";
import { AddModalProps } from "@/modules/countries/countries.types";
import TextBox from "@/components/TextBox";
import { ROLES } from "@/constants/data";


const AddStaffModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();

    const [titles, setTitles] = useState<DropdownType[]>([]);
    const [genders, setGenders] = useState<DropdownType[]>([]);
    const [branches, setBranches] = useState<DropdownType[]>([]);

    const fetchDropdownData = async () => {
        try {
            const [titlesRes, gendersRes, branchesRes] = await Promise.all([
                getTitles(),
                getGenders(),
                getBranches()
            ]);

            if (titlesRes.success) setTitles(titlesRes.titles);
            if (gendersRes.success) setGenders(gendersRes.genders);
            if (branchesRes.success) setBranches(branchesRes.branches);
        } catch (error) {
            toast.error("Error fetching dropdown data");
        }
    };

    useEffect(() => {
        if (isOpen) fetchDropdownData();
    }, [isOpen]);

    const handleSubmit = async (
        values: StaffType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            const response = await createStaff(values);
            if (response.success) {
                toast.success(response.message);
                handleReload();
                onClose();
                resetForm();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the staff.");
            console.log(error);
        }
    };

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
                        Add New Staff Member
                    </DialogTitle>
                    <CloseIcon data-testid="CloseIcon" sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
                </Box>
                <Formik
                    initialValues={addStaffInitialValues}
                    validationSchema={addStaffValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting, setFieldValue }) => (
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
                                    <Grid item xs={12} sm={6}>
                                        <Typography fontSize="12px">Title</Typography>
                                        <Field
                                            as="select"
                                            name="title"
                                            className="border p-2 w-full rounded-md border-gray-300"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                setFieldValue('title', Number(e.target.value));
                                            }}
                                        >
                                            <option value="">Select</option>
                                            {titles.map((item) => (
                                                <option key={item.id} value={item.id}>{item.title.EN}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="title" component="div" className="text-red-400 text-xs pl-1" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography fontSize="12px">Gender</Typography>
                                        <Field
                                            as="select"
                                            name="gender"
                                            className="border p-2 w-full rounded-md border-gray-300"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                setFieldValue('gender', Number(e.target.value));
                                            }}
                                        >
                                            <option value="">Select</option>
                                            {genders.map((item) => (
                                                <option key={item.id} value={item.id}>{item.title.EN}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="gender" component="div" className="text-red-400 text-xs pl-1" />
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
                                        <Typography fontSize="12px">Password</Typography>
                                        <TextBox
                                            name="password"
                                            label=""
                                            as="input"
                                            type="password"
                                            fullWidth
                                            error={touched.password && !!errors.password}
                                            helperText={touched.password && errors.password}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Email Address</Typography>
                                        <TextBox
                                            name="email"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.email && !!errors.email}
                                            helperText={touched.email && errors.email}
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
                                    <Grid item xs={12} sm={6}>
                                        <Typography fontSize="12px">Branch</Typography>
                                        <Field
                                            as="select"
                                            name="branchId"
                                            className="border p-2 w-full rounded-md border-gray-300"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                setFieldValue('branchId', Number(e.target.value));
                                            }}
                                        >
                                            <option value="">Select</option>
                                            {branches.map((item) => (
                                                <option key={item.id} value={item.id}>{item.title.EN}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="branchId" component="div" className="text-red-400 text-xs pl-1" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Roll</Typography>
                                        <Field
                                            as="select"
                                            name="roll"
                                            className="border p-2 w-full rounded-md border-gray-300"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                setFieldValue('roll', Number(e.target.value));
                                            }}
                                        >
                                            <option value="">Select</option>
                                            {ROLES.map((role) => (
                                                <option key={role.id} value={role.id}>{role.label}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="roll" component="div" className="text-red-400 text-xs pl-1" />
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
                                    onClick={onClose}
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
                                    Save
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

export default AddStaffModal;
