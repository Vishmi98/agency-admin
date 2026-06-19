"use client";

import React from "react";
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
import { Formik, Form, FormikProps } from "formik";
import { toast, } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';

import { AddOutTimeFormValues, InTimeType_ } from "../attendanceMarks.types";
import { addInTime } from "../services/attendanceMark.services";
import { addInTimeValidationSchema } from "../attendanceMarks.utils";

import TextBox from "@/components/TextBox";
import { getTodayDate } from "@/modules/attendances/attendance.utils";


const AddInTimeModal = (props: AddOutTimeFormValues) => {
    const { handleClose, open, handleReload, selectedRow } = props;
    const todayDate = getTodayDate();

    console.log("init", selectedRow.staffId);

    const theme = useTheme();

    const formatTo12Hour = (time: string): string => {
        const [hours, minutes] = time.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes < 10 ? "0" + minutes : minutes} ${period}`;
    };

    const handleSubmit = async (
        values: InTimeType_,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            const formattedTime = formatTo12Hour(values.inTime);

            console.log("values 00", values);
            console.log("time 00", formattedTime);
            console.log("init 00", selectedRow);

            const body = {
                "date": todayDate,
                "staffId": selectedRow.staffId,
                "inTime": formattedTime
            }

            console.log("body 00", body);


            const response = await addInTime(body);
            if (response.success) {
                toast.success(response.message);
                handleReload();
                handleClose();
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
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="xs"
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
                        Add In Time
                    </DialogTitle>
                    <CloseIcon sx={{ width: 15, height: 15, marginRight: 3 }} />
                </Box>
                <Formik
                    initialValues={{ inTime: '' }}
                    validationSchema={addInTimeValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting }: FormikProps<InTimeType_>) => (
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
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">In Time</Typography>
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

export default AddInTimeModal;
