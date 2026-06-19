"use client";

import React, { useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { Formik, Form, FormikProps, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { MainCommissionFormValues, MainCommissionType } from "../commission.types";
import { addMainCommission } from "../service/commission.service";
import { addMainCommissionInitialValues, addMainCommissionValidationSchema } from "../commission.utils";

import TextBox from "@/components/TextBox";
import { InvoiceDataType } from "@/modules/invoice/invoice.types";


const AddMainCommission = (props: MainCommissionFormValues) => {
    const { handleReload, invoices } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDataType | null>(null);

    const theme = useTheme();

    const handleSubmit = async (
        values: MainCommissionType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            setIsLoading(true);
            const response = await addMainCommission(values);
            if (response.success) {
                toast.success(response.message);
                resetForm();
                handleReload();
                setSelectedInvoice(null);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding main commission");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Box sx={{ width: "100%", marginTop: 2 }}>
                <Formik
                    initialValues={addMainCommissionInitialValues}
                    validationSchema={addMainCommissionValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        touched,
                        errors,
                        setFieldValue,
                    }: FormikProps<MainCommissionType>) => {
                        return (
                            <Form>
                                <Box
                                    sx={{
                                        maxHeight: "400px",
                                        overflowY: "auto",
                                        backgroundColor: theme.palette.background.paper,
                                        width: "100%"
                                    }}
                                >
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Invoice ID</Typography>
                                            <Autocomplete
                                                options={invoices}
                                                getOptionLabel={(option) =>
                                                    `INV ${option.id} - ${option.studentInfo?.firstName} ${option.studentInfo?.lastName}`
                                                }
                                                loading={isLoading}
                                                onChange={async (event, value) => {
                                                    const invoiceId = value ? value.id : '';
                                                    setFieldValue('invoiceId', invoiceId);
                                                    setSelectedInvoice(value || null);

                                                    // ✅ Auto-fill amount with staff commissionAmount
                                                    if (value?.staffInfo?.commissionAmount !== undefined) {
                                                        setFieldValue('amount', value.staffInfo.commissionAmount);
                                                    } else {
                                                        setFieldValue('amount', 0); // fallback
                                                    }
                                                }}
                                                size="small"
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder="Search..."
                                                        fullWidth
                                                        error={touched.invoiceId && Boolean(errors.invoiceId)}
                                                        helperText={touched.invoiceId && errors.invoiceId}
                                                    />
                                                )}
                                            />
                                            <ErrorMessage name="invoiceId" component="div" className="text-red-400 text-xs mt-1.5 pl-2" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Date</Typography>
                                            <Field
                                                name="date"
                                                type="date"
                                                as="input"
                                                fullWidth
                                                className="border p-1.5 w-full rounded-[5px]"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Amount</Typography>
                                            <Field
                                                name="amount"
                                                type="number"
                                                as={TextField}
                                                fullWidth
                                                size="small"
                                                InputProps={{ readOnly: true }} // 🔹 makes it read-only
                                                disabled // 🔹 also disable editing
                                                error={touched.amount && !!errors.amount}
                                                helperText={touched.amount && errors.amount}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Percentage</Typography>
                                            <TextBox
                                                name="percentage"
                                                label=""
                                                as="input"
                                                type="number"
                                                fullWidth
                                                error={touched.percentage && !!errors.percentage}
                                                helperText={touched.percentage && errors.percentage}
                                            />
                                        </Grid>
                                    </Grid>
                                    {/* ✅ Selected Commission Details */}
                                    {selectedInvoice && (
                                        <Box
                                            sx={{
                                                border: "1px solid #ddd",
                                                borderRadius: "8px",
                                                padding: "8px",
                                                marginTop: 1,
                                                backgroundColor: "#fafafa",
                                            }}
                                        >
                                            <Typography fontWeight="bold" fontSize="12px" marginBottom={0.5}>
                                                Invoice Details
                                            </Typography>

                                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
                                                {/* Left Side */}
                                                <Box>
                                                    <Typography fontSize="12px">Invoice ID: INV-{selectedInvoice.id}</Typography>
                                                    <Typography fontSize="12px">
                                                        Student: {selectedInvoice.studentInfo?.firstName}{" "}
                                                        {selectedInvoice.studentInfo?.lastName}
                                                    </Typography>
                                                    <Typography fontSize="12px">
                                                        Staff: {selectedInvoice.staffInfo?.firstName}{" "}
                                                        {selectedInvoice.staffInfo?.lastName}
                                                    </Typography>
                                                </Box>

                                                {/* Right Side */}
                                                <Box>
                                                    {selectedInvoice.dueAmount !== undefined && (
                                                        <Typography fontSize="12px">
                                                            Due amount: LKR {selectedInvoice.dueAmount.toLocaleString()}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}

                                    <Box
                                        sx={{
                                            position: "sticky",
                                            bottom: 0,
                                            backgroundColor: theme.palette.background.paper,
                                            zIndex: 1000,
                                            width: "100%",
                                            marginTop: 1
                                        }}
                                    >
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isLoading}
                                            sx={{
                                                backgroundColor: "#1976d2",
                                                borderRadius: "5px",
                                                textTransform: "none",
                                                "&:hover": { backgroundColor: "#115293" },
                                                width: "20%"
                                            }}
                                        >
                                            {isLoading ? "Adding..." : "Add"}
                                        </Button>
                                    </Box>
                                </Box>
                            </Form>
                        );
                    }}
                </Formik>
            </Box>
        </>
    );
};

export default AddMainCommission;
