"use client";

import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
    Button,
    Grid,
    Paper,
    Typography,
    FormControlLabel,
    Checkbox,
    Box,
    Dialog,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { createStudent, getVisaStatuses } from "../services/student.services";
import { StudentType } from "../student.types";
import { addStudentInitialValues, addStudentValidationSchema } from "../student.utils";

import { DropdownType } from "@/type/common.types";
import { getBranches, getStaffData, getTitles } from "@/modules/staff/services/staff.services";
import TextBox from "@/components/TextBox";
import { StaffDataType } from "@/modules/staff/staff.types";


export default function StudentForm() {
    const [titles, setTitles] = useState<DropdownType[]>([]);
    const [visaStatuses, setVisaStatuses] = useState<DropdownType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [staffs, setStaffs] = useState<StaffDataType[]>([]);
    const [branches, setBranches] = useState<DropdownType[]>([]);

    const [openSuccess, setOpenSuccess] = useState(false);

    const fetchDropdownData = async () => {
        try {
            const [titlesData, visaStatusesData, staffsRes, branchesRes] = await Promise.all([
                getTitles(),
                getVisaStatuses(),
                getStaffData(1, 100),
                getBranches()
            ]);

            setTitles(titlesData.success ? titlesData.titles : []);
            setVisaStatuses(visaStatusesData.success ? visaStatusesData.visaStatusTypes : []);
            setStaffs(staffsRes.success ? staffsRes.staffs : []);
            setBranches(branchesRes.success ? branchesRes.branches : [])

        } catch (error) {
            console.log("Error fetching dropdown data", error);
        }
    };

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const handleSubmit = async (
        values: StudentType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            setIsLoading(true);
            setOpenSuccess(false)
            const updatedValues = {
                ...values,
                email: values.email?.toLowerCase(),
                createdBy: 134,
                branchId: 100
            };

            const response = await createStudent(updatedValues);

            console.log("res", response);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            resetForm();
            setOpenSuccess(true)
        } catch (error) {
            toast.error("An error occurred while adding the student.");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    maxWidth: 1100,
                    mx: "auto",
                    mt: { xs: 0, lg: 5 },
                    borderRadius: { xs: 0, lg: 5 },
                    overflow: "hidden",
                    background: "#fff",
                }}
            >

                {/* HEADER */}
                <Box sx={{ display: "flex", gap: { xs: 2, lg: 3 }, p: { xs: 2, lg: 3 }, alignItems: "center", justifyContent: "flex-start" }}>
                    <Image src="/logo1.png" alt="logo" height={100} width={100} priority />

                    <Box>
                        <Typography
                            fontWeight={700}
                            sx={{
                                fontSize: {
                                    xs: "16px",
                                    sm: "26px",
                                    md: "30px",
                                },
                                marginBottom: 1
                            }}
                        >
                            Student Registration Form
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#444" }}>
                            Fill all required details carefully to complete student registration.
                        </Typography>
                    </Box>
                </Box>

                {/* FORM */}
                <Box sx={{ p: { xs: 2, lg: 3 } }}>
                    <Formik
                        initialValues={addStudentInitialValues}
                        validationSchema={addStudentValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, setFieldValue, errors, touched }) => (
                            <Form>

                                <Box display="flex" flexDirection="column" gap={2}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        Personal Details
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Title</Typography>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    name="title"
                                                    value={values.title}
                                                    onChange={(e) =>
                                                        setFieldValue("title", e.target.value)
                                                    }
                                                >
                                                    <MenuItem value="">
                                                        Select
                                                    </MenuItem>

                                                    {titles.map((title) => (
                                                        <MenuItem
                                                            key={title.id}
                                                            value={title.id}
                                                        >
                                                            {title.title?.EN}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
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

                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Visa Status</Typography>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    name="visaStatus"
                                                    value={values.visaStatus}
                                                    onChange={(e) =>
                                                        setFieldValue("visaStatus", e.target.value)
                                                    }
                                                >
                                                    <MenuItem value="">
                                                        Select
                                                    </MenuItem>

                                                    {visaStatuses.map((visaStatus) => (
                                                        <MenuItem
                                                            key={visaStatus.id}
                                                            value={visaStatus.id}
                                                        >
                                                            {visaStatus.title?.EN}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <ErrorMessage name="visaStatus" component="div" className="text-red-300 text-xs m-1" />
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* ================= TERMS ================= */}
                                <Typography fontWeight={700} mt={4} mb={1}>
                                    Terms & Conditions
                                </Typography>

                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        maxHeight: 80,
                                        overflowY: "auto",
                                        backgroundColor: "#fafafa",
                                        fontSize: "13px",
                                        lineHeight: "20px",
                                    }}
                                >
                                    <Typography variant="body2" gutterBottom>
                                        1. The student confirms that all information provided in this application is true and accurate.
                                    </Typography>

                                    <Typography variant="body2" gutterBottom>
                                        2. The institution reserves the right to verify all submitted documents including passport and academic records.
                                    </Typography>

                                    <Typography variant="body2" gutterBottom>
                                        3. Fees once paid are non-refundable unless otherwise stated in the refund policy.
                                    </Typography>

                                    <Typography variant="body2" gutterBottom>
                                        4. The student agrees to follow all rules and regulations of the institution during their study period.
                                    </Typography>

                                    <Typography variant="body2" gutterBottom>
                                        5. Visa approval is not guaranteed and depends on immigration authorities.
                                    </Typography>

                                    <Typography variant="body2">
                                        6. Any violation of rules may result in termination of enrollment without refund.
                                    </Typography>
                                </Paper>

                                <Box mt={2}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.isAgree}
                                                onChange={(e) => setFieldValue("isAgree", e.target.checked)}
                                            />
                                        }
                                        label="I have read and agree to the Terms & Conditions"
                                    />
                                </Box>

                                {/* SUBMIT */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isLoading || !values.isAgree}
                                    sx={{
                                        mt: 3,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        width: { xs: "100%", md: "30%" }
                                    }}
                                >
                                    {isLoading ? "Registering..." : "Register Student"}
                                </Button>

                            </Form>
                        )}
                    </Formik>
                </Box>
            </Paper>
            <Dialog
                open={openSuccess}
                onClose={() => setOpenSuccess(false)}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        p: 2,
                        textAlign: "center",
                    }
                }}
            >
                <DialogTitle>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <CheckCircleIcon sx={{ fontSize: 60, color: "success.main" }} />

                        <Typography fontWeight={700} sx={{ fontSize: {xs: "20px", lg: "24px"} }}>
                            Registration Successful
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Student has been successfully registered
                        </Typography>
                    </Box>
                </DialogTitle>
            </Dialog>
        </>
    );
}