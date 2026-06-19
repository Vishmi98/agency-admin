"use client";

import React, { FC, useEffect, useState } from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';

import InvoiceDetails from './InvoiceDetails';
import { PaymentType } from '../payment.types';
import { addPaymentInitialValues, addPaymentValidationSchema } from '../payment.utils';
import { createPayment } from '../services/payment.services';

import TextBox from '@/components/TextBox';
import { AddModalProps } from '@/modules/countries/countries.types';
import { getCookieUser } from '@/utils/cookie.util';
import { InvoiceDataType } from '@/modules/invoice/invoice.types';
import { DropdownType } from '@/type/common.types';
import { getPaymentTypes } from '@/modules/paymentTypes/services/paymentTypes.services';
import { getDueInvoiceData } from '@/modules/invoice/services/invoice.services';
import { getBranches } from '@/modules/staff/services/staff.services';


const AddPaymentModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();

    const user = getCookieUser();

    const [invoices, setInvoices] = useState<InvoiceDataType[]>([]);
    const [paymentTypes, setPaymentTypes] = useState<DropdownType[]>([]);
    const [branches, setBranches] = useState<DropdownType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDataType | null>(null);

    const fetchData = async () => {
        try {
            const [invoicesRes, paymentTypesRes, branchesRes] = await Promise.all([
                getDueInvoiceData(1, 1000),
                getPaymentTypes(),
                getBranches()
            ]);
            if (invoicesRes.success) setInvoices(invoicesRes.invoices);
            if (paymentTypesRes.success) setPaymentTypes(paymentTypesRes.paymentTypes);
            if (branchesRes.success) setBranches(branchesRes.branches);
        } catch (error) {
            // console.log("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isOpen]);

    const handleSubmit = async (
        values: PaymentType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            setIsLoading(true);
            values.createdBy = user && user.id ? Number(user.id) : 0;
            values.studentId = selectedInvoice?.studentInfo?.id
            values.amountUsd = values.amountLkr

            const response = await createPayment(values);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            handleReload();
            onClose();
            resetForm();
        } catch (error) {
            toast.error("An error occurred while adding the payment.");
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
                <DialogTitle
                    sx={{
                        color: theme.palette.text.primary,
                        padding: "16px 24px",
                        fontWeight: "bold",
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                    }}
                >
                    Add New Payment
                </DialogTitle>
                <Formik
                    initialValues={addPaymentInitialValues}
                    validationSchema={addPaymentValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting, setFieldValue, values }) => (
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
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Invoice ID</Typography>
                                            <Autocomplete
                                                options={invoices}
                                                getOptionLabel={(option) => `INV ${option.id} - ${option.studentInfo?.firstName} ${option.studentInfo?.lastName}`}
                                                loading={isLoading}
                                                onChange={(event, value) => {
                                                    setFieldValue('invoiceId', value ? value.id : '');
                                                    setSelectedInvoice(value);
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
                                            <Typography fontSize="12px">Date</Typography>
                                            <TextBox
                                                name="paymentDate"
                                                label=""
                                                as="input"
                                                type="date"
                                                fullWidth
                                                error={touched.paymentDate && !!errors.paymentDate}
                                                helperText={touched.paymentDate && errors.paymentDate}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography fontSize="12px">Amount (LKR)</Typography>
                                            <TextBox
                                                name="amountLkr"
                                                label=""
                                                as="input"
                                                type="number"
                                                fullWidth
                                                error={touched.amountLkr && !!errors.amountLkr}
                                                helperText={touched.amountLkr && errors.amountLkr}
                                            />
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
                                            <Typography fontSize="12px">Branch</Typography>
                                            <Field
                                                as="select"
                                                name="branchId"
                                                className="border p-2 w-full rounded-md border-gray-300"
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                    const selectedId = Number(e.target.value);
                                                    setFieldValue('branchId', selectedId);
                                                }}
                                            >
                                                <option value="">Select Branch</option>
                                                {branches.map((branch) => (
                                                    <option key={branch.id} value={branch.id}>
                                                        {branch.title.EN}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="branchId" component="div" className="text-red-300 text-xs m-1" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            {values?.invoiceId && (
                                                <InvoiceDetails invoice={selectedInvoice} />
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
                                    Save Payment
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
};

export default AddPaymentModal;
