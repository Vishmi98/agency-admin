"use client";

import React, { FC, useEffect, useState } from "react";
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    Typography,
    Grid,
    useTheme,
    Dialog,
    DialogTitle,
    Autocomplete,
    TextField,
    CircularProgress,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast, ToastContainer } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';

import { UniversityPaymentType } from "../university.types";
import { createUniversityPayment } from "../services/university.services";
import { addUniversityPaymentInitialValues, addUniversityPaymentValidationSchema } from "../university.utils";

import { DropdownType } from "@/type/common.types";
import { InvoiceDataType } from "@/modules/invoice/invoice.types";
import { getInvoiceData } from "@/modules/invoice/services/invoice.services";
import { getCookieUser } from "@/utils/cookie.util";
import { AddModalProps } from "@/modules/countries/countries.types";
import { getPaymentTypes } from "@/modules/paymentTypes/services/paymentTypes.services";
import TextBox from "@/components/TextBox";


const AddUniversityPayment: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();

    const user = getCookieUser();

    const [invoices, setInvoices] = useState<InvoiceDataType[]>([]);
    const [paymentTypes, setPaymentTypes] = useState<DropdownType[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDropdownData = async () => {
        try {
            const [paymentTypeRes, invoicesDataRes,] = await Promise.all([
                getPaymentTypes(),
                getInvoiceData(1, 100),
            ]);

            setPaymentTypes(paymentTypeRes.success ? paymentTypeRes.paymentTypes : []);
            setInvoices(invoicesDataRes.success ? invoicesDataRes.invoices : []);

        } catch (error) {
            console.log("Error fetching dropdown data", error);
        }
    };

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        } else {
            setSelectedImage(null);
        }
    };

    const handleSubmit = async (
        values: UniversityPaymentType,
        { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        try {
            if (!user || typeof user === "string") {
                toast.error("User not found or invalid.");
                return;
            }

            setIsLoading(true);

            const formData = new FormData();
            formData.append("invoiceId", values.invoiceId.toString());
            formData.append("paymentType", values.paymentType.toString());
            formData.append("date", values.date);
            formData.append("createdBy", user.id.toString());

            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            const response = await createUniversityPayment(formData);

            if (response.success) {
                toast.success(response.message || "University payment added successfully!");
                resetForm();
                setSelectedImage(null);
                handleReload();
                onClose();
            } else {
                toast.error(response.message || "Failed to add university payment.");
            }
        } catch (error: any) {
            console.log("Error submitting form:", error);
            toast.error("Something went wrong while submitting the form.");
        } finally {
            setIsLoading(false);
            setSubmitting(false);
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
                        Add New University Payment
                    </DialogTitle>
                    <CloseIcon sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
                </Box>
                <Formik
                    initialValues={addUniversityPaymentInitialValues}
                    validationSchema={addUniversityPaymentValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting, setFieldValue }) => (
                        <Form>
                            <DialogContent
                                sx={{
                                    padding: "24px",
                                    maxHeight: "400px",
                                    overflowY: "auto",
                                    backgroundColor: theme.palette.background.paper,
                                }}
                            >
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Date</Typography>
                                            <TextBox
                                                name="date"
                                                label=""
                                                as="input"
                                                type="date"
                                                fullWidth
                                                error={touched.date && !!errors.date}
                                                helperText={touched.date && errors.date}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Invoice ID</Typography>
                                            <Autocomplete
                                                options={invoices}
                                                getOptionLabel={(option) =>
                                                    `INV ${option.id} - ${option.studentInfo?.firstName} ${option.studentInfo?.lastName}`
                                                }
                                                loading={isLoading}
                                                onChange={(event, value) => {
                                                    setFieldValue("invoiceId", value ? value.id : "");
                                                }}
                                                size="small"
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder="Search invoice..."
                                                        fullWidth
                                                        error={touched.invoiceId && Boolean(errors.invoiceId)}
                                                        helperText={touched.invoiceId && errors.invoiceId}
                                                    />
                                                )}
                                            />
                                            <ErrorMessage name="invoiceId" component="div" className="text-red-300 text-xs m-1" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Payment Type</Typography>
                                            <Field
                                                as="select"
                                                name="paymentType"
                                                className="border p-2 w-full rounded-md border-gray-300"
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                    const selectedId = Number(e.target.value);
                                                    setFieldValue('paymentType', selectedId);
                                                }}
                                            >
                                                <option value="">Select Payment Type</option>
                                                {paymentTypes.map((paymentType) => (
                                                    <option key={paymentType.id} value={paymentType.id}>
                                                        {paymentType.title.EN}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="paymentType" component="div" className="text-red-300 text-xs m-1" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Upload Document</Typography>
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.png,.docx,.jpeg"
                                                onChange={handleImageChange}
                                                className="border p-2 w-full rounded-md border-gray-300 mb-3"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            {/* <ErrorMessage name="image" component="div" className="text-red-300 text-xs m-1" /> */}
                                            {selectedImage && selectedImage.type.startsWith("image") ? (
                                                <img
                                                    src={URL.createObjectURL(selectedImage)}
                                                    alt="selected"
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        marginTop: '10px',
                                                    }} />
                                            ) : selectedImage && selectedImage.type === "application/pdf" ? (
                                                <a href={URL.createObjectURL(selectedImage)} target="_blank" rel="noopener noreferrer" className='underline'>
                                                    View PDF
                                                </a>
                                            ) : (
                                                <p>No file selected</p>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Box>
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
                                    {isSubmitting || isLoading ? (
                                        <>
                                            <CircularProgress size={18} sx={{ color: "#fff" }} />
                                        </>
                                    ) : (
                                        "Add"
                                    )}
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

export default AddUniversityPayment;
