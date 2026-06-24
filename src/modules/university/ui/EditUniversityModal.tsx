"use client";

import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Grid,
    useTheme,
    Box,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { toast, ToastContainer } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';

import { EditUniversityModalProps, UniversityType } from "../university.types";
import { updateUniversity } from "../services/university.services";
import { addUniversityValidationSchema } from "../university.utils";

import TextBox from "@/components/TextBox";
import { DropdownType } from "@/type/common.types";
import { getCookieUser } from "@/utils/cookie.util";
import { getCountriesData } from "@/modules/countries/services/countries.services";
import { logActivity } from "@/utils/logActivity";


const EditUniversityModal: React.FC<EditUniversityModalProps> = ({ isOpen, onClose, initialValues, reloadData }) => {
    const theme = useTheme();
    const user = getCookieUser();

    const [countries, setCountries] = useState<DropdownType[]>([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await getCountriesData();
                if (response.success) {
                    setCountries(response.countries);
                } else {
                    toast.error(response.message || "Failed to fetch countries");
                }
            } catch (error) {
                toast.error("Error fetching countries");
            }
        };

        if (isOpen) {
            fetchCountries();

            if (user) {
                logActivity({
                    userId: user.id,
                    action: "EDIT_UNIVERSITY_MODAL_OPEN",
                    path: "/modules/university/ui/EditUniversityModal",
                    method: "CLIENT",
                });
            }
        }
    }, [isOpen]);

    const handleSubmit = async (values: UniversityType, { resetForm }: FormikHelpers<UniversityType>) => {
        try {
            const response = await updateUniversity(values.id, values);

            if (response.success) {
                toast.success(response.message);

                if (user) {
                    logActivity({
                        userId: user.id,
                        action: "UNIVERSITY_EDITED_SUCCESS",
                        path: "/modules/university/ui/EditUniversityModal",
                        endpoint: "/api/university/update",
                        method: "POST",
                        meta: {
                            university: values.name,
                        }
                    });
                }

                reloadData();
                onClose();
                resetForm();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating the course.");
            console.error(error);
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
                        Edit University
                    </DialogTitle>
                    <CloseIcon data-testid="CloseIcon" sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
                </Box>
                <Formik
                    initialValues={initialValues}
                    validationSchema={addUniversityValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting, setFieldValue, dirty }) => (
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
                                        <Typography fontSize="12px">University Name</Typography>
                                        <TextBox
                                            name="name"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.name && !!errors.name}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Short Code</Typography>
                                        <TextBox
                                            name="code"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.code && !!errors.code}
                                            helperText={touched.code && errors.code}
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
                                        <Typography fontSize="12px">Rank</Typography>
                                        <TextBox
                                            name="rank"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.rank && !!errors.rank}
                                            helperText={touched.rank && errors.rank}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Phone Number</Typography>
                                        <TextBox
                                            name="phoneNumber"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.phoneNumber && !!errors.phoneNumber}
                                            helperText={touched.phoneNumber && errors.phoneNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Country</Typography>
                                        <Field
                                            as="select"
                                            name="countryId"
                                            className="border p-2 w-full rounded-md border-gray-300 text-[16px]"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                const selectedId = Number(e.target.value);
                                                setFieldValue('countryId', selectedId);
                                            }}
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map((country) => (
                                                <option key={country.id} value={country.id}>
                                                    {country.title["EN"]}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="countryId" component="div" className="text-red-300 text-xs ml-3 mt-2" />
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
                                                action: "EDIT_UNIVERSITY_CANCEL",
                                                path: "/modules/university/ui/EditUniversityModal",
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
                                    disabled={isSubmitting || !dirty}
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

export default EditUniversityModal;
