"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    DialogActions,
    Typography,
    Grid,
    useTheme,
    Autocomplete,
    TextField,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

import { StudentType } from "../student.types";
import { addStudentInitialValues, addStudentValidationSchema } from "../student.utils";
import { createStudent, getVisaStatuses } from "../services/student.services";

import TextBox from "@/components/TextBox";
import { DropdownType } from "@/type/common.types";
import { getBranches, getStaffData, getTitles } from "@/modules/staff/services/staff.services";
import { StaffDataType } from "@/modules/staff/staff.types";


const AddStudent = () => {
    const theme = useTheme();

    const router = useRouter();

    const [titles, setTitles] = useState<DropdownType[]>([]);
    const [visaStatuses, setVisaStatuses] = useState<DropdownType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [staffs, setStaffs] = useState<StaffDataType[]>([]);
    const [branches, setBranches] = useState<DropdownType[]>([]);

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

            const updatedValues = {
                ...values,
                email: values.email?.toLowerCase(), // <- Ensure lowercase here
            };

            const response = await createStudent(updatedValues);

            console.log("res", response);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            resetForm();
            router.push('/admin/students')
        } catch (error) {
            toast.error("An error occurred while adding the student.");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Formik
                initialValues={addStudentInitialValues}
                validationSchema={addStudentValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ touched, errors, isSubmitting, setFieldValue, values }) => (
                    <Form>
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
                                        className="border p-2 w-full rounded-md border-gray-300 text-[16px]"
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            const selectedId = Number(e.target.value);
                                            setFieldValue('title', selectedId);
                                        }}
                                    >
                                        <option value="">Select</option>
                                        {titles.map((title) => (
                                            <option key={title.id} value={title.id}>
                                                {title.title?.EN || "No Titles"}
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
                                <Grid item xs={12} md={6}>
                                    <Typography fontSize="12px">Branch</Typography>
                                    <Field
                                        as="select"
                                        name="branchId"
                                        className="border p-2 w-full rounded-md border-gray-300 text-[16px]"
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            const selectedId = Number(e.target.value);
                                            setFieldValue('branchId', selectedId);
                                        }}
                                    >
                                        <option value="">Select</option>
                                        {branches.map((branch) => (
                                            <option key={branch.id} value={branch.id}>
                                                {branch?.title?.EN}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="branchId" component="div" className="text-red-300 text-xs m-1" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography fontSize="12px">Select Staff Member</Typography>
                                    <Autocomplete
                                        options={staffs}
                                        getOptionLabel={(option) => option.fullName}
                                        loading={isLoading}
                                        onChange={(event, value) => {
                                            setFieldValue('createdBy', value ? value.id : '');
                                        }}
                                        value={staffs.find((s) => s.id === values.createdBy) || null}
                                        size="small"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                placeholder="Search Staff..."
                                                fullWidth
                                                error={touched.createdBy && Boolean(errors.createdBy)}
                                                helperText={touched.createdBy && errors.createdBy}
                                                sx={{ fontSize: "16px" }}
                                            />
                                        )}
                                    />
                                    <ErrorMessage name="createdBy" component="div" className="text-red-300 text-xs m-1" />
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
                                    <Field
                                        as="select"
                                        name="visaStatus"
                                        className="border p-2 w-full rounded-md border-gray-300 text-[16px]"
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            const selectedId = Number(e.target.value);
                                            setFieldValue('visaStatus', selectedId);
                                        }}
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
                            </Grid>
                        </Box>
                        <DialogActions
                            sx={{
                                paddingY: "16px",
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
                                Add
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
            <ToastContainer />
        </>
    );
};

export default AddStudent;
