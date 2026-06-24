"use client";

import React, { FC, useEffect, useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { Formik, Form, FormikProps, ErrorMessage } from "formik";
import { toast, ToastContainer } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';

import { LeadType } from "../leads.types";
import { createLead } from "../leads.service";
import { addLeadInitialValues, addLeadValidationSchema } from "../leads.utils";

import { AddModalProps } from "@/modules/countries/countries.types";
import { getStudentData } from "@/modules/student/services/student.services";
import { getStaffData } from "@/modules/staff/services/staff.services";
import { StudentDataType } from "@/modules/student/student.types";
import { StaffDataType } from "@/modules/staff/staff.types";
import { CourseDataType } from "@/modules/courses/courses.types";
import { getCoursesData } from "@/modules/courses/services/courses.service";
import { getCookieUser } from "@/utils/cookie.util";
import { logActivity } from "@/utils/logActivity";


const AddLeadModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();

    const [courses, setCourses] = useState<CourseDataType[]>([]);
    const [students, setStudents] = useState<StudentDataType[]>([]);
    const [staffs, setStaffs] = useState<StaffDataType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const user = getCookieUser();

    const fetchData = async () => {
        try {
            const [coursesRes, studentRes, staffRes] = await Promise.all([
                getCoursesData(1, 100),
                getStudentData(1, 100),
                getStaffData(1, 100),
            ]);

            if (coursesRes.success) setCourses(coursesRes.courses);
            if (studentRes.success) setStudents(studentRes.students);
            if (staffRes.success) setStaffs(staffRes.staffs);
        } catch (error) {
            toast.error("Error fetching data");
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchData();

            if (user) {
                logActivity({
                    userId: user.id,
                    action: "ADD_LEAD_MODAL_OPEN",
                    path: "/modules/leads/ui/AddLeadModal",
                    method: "CLIENT",
                });
            }
        }
    }, [isOpen]);

    const handleSubmit = async (
        values: LeadType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            setIsLoading(true);

            const response = await createLead(values);

            if (response.success) {
                toast.success(response.message);
                if (user) {
                    logActivity({
                        userId: user.id,
                        action: "LEAD_CREATED_SUCCESS",
                        path: "/modules/leads/ui/AddLeadModal",
                        endpoint: "/api/lead/create",
                        method: "POST",
                        meta: {
                            studentId: values.studentId,
                            staffId: values.staffId,
                            courseId: values.courseId,
                        }
                    });
                }

                handleReload();
                onClose();
                resetForm();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the lead.");
            console.log(error);
        } finally {
            setIsLoading(false);
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
                        Add New Lead
                    </DialogTitle>
                    <CloseIcon data-testid="CloseIcon" sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
                </Box>
                <Formik
                    initialValues={addLeadInitialValues}
                    validationSchema={addLeadValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting, setFieldValue, values }: FormikProps<LeadType>) => (
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
                                        <Typography fontSize="12px">Select Student</Typography>
                                        <Autocomplete
                                            options={students}
                                            getOptionLabel={(option) => `${option.id} - ${option?.firstName} ${option?.lastName}`}
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
                                        <ErrorMessage name="studentId" component="div" className="text-red-300 text-xs pl-3" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Select Staff</Typography>
                                        <Autocomplete
                                            options={staffs}
                                            getOptionLabel={(option) => `${option.id} - ${option?.firstName} ${option?.lastName}`}
                                            loading={isLoading}
                                            onChange={(event, value) => {
                                                setFieldValue('staffId', value ? value.id : '');
                                            }}
                                            size="small"
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    placeholder="Search Staff..."
                                                    fullWidth
                                                    error={touched.staffId && Boolean(errors.staffId)}
                                                    helperText={touched.staffId && errors.staffId}
                                                />
                                            )}
                                        />
                                        <ErrorMessage name="staffId" component="div" className="text-red-300 text-xs pl-3" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Select Course</Typography>
                                        <Autocomplete
                                            options={courses}
                                            getOptionLabel={(option) => `${option.title}`}
                                            loading={isLoading}
                                            onChange={(event, value) => {
                                                setFieldValue('courseId', value ? value.id : '');
                                            }}
                                            size="small"
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    placeholder="Search Course..."
                                                    fullWidth
                                                    error={touched.courseId && Boolean(errors.courseId)}
                                                    helperText={touched.courseId && errors.courseId}
                                                />
                                            )}
                                        />
                                        <ErrorMessage name="courseId" component="div" className="text-red-300 text-xs pl-3" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Note</Typography>

                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Enter note..."
                                            multiline
                                            minRows={3}
                                            value={values.note}
                                            onChange={(e) => setFieldValue("note", e.target.value)}
                                            error={touched.note && Boolean(errors.note)}
                                            helperText={touched.note && errors.note}
                                        />

                                        <ErrorMessage
                                            name="note"
                                            component="div"
                                            className="text-red-300 text-xs pl-3"
                                        />
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
                                    onClick={() => {
                                        onClose();

                                        if (user) {
                                            logActivity({
                                                userId: user.id,
                                                action: "ADD_LEAD_CANCEL",
                                                path: "/modules/leads/ui/AddLeadModal",
                                                method: "CLIENT",
                                            });
                                        }
                                    }}
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
                                    Save Lead
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

export default AddLeadModal;
