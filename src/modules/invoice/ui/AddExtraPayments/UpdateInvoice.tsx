"use client";

import React, { useEffect, useState } from "react";
import * as Yup from 'yup';
import { useRouter } from "next/navigation";
import {
    Autocomplete,
    Box,
    Button,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import { toast } from "react-toastify";

import AddedExtraPayments from "./AddedExtraPayments";
import { InvoiceDataType, InvoiceType } from "../../invoice.types";
import { getInvoiceData, updateInvoice } from "../../services/invoice.services";
import { addInvoiceInitialValues } from "../../invoice.utils";

import { getExtraPaymentData } from "@/modules/extraPayment/services/extraPayment.services";
import { ExtraPaymentDataType } from "@/modules/extraPayment/extraPayment.types";


const UpdateInvoice = () => {
    const theme = useTheme();

    const router = useRouter();

    const [invoices, setInvoices] = useState<InvoiceDataType[]>([]);
    const [initExtraPayments, setInitExtraPayments] = useState<ExtraPaymentDataType[]>([]);
    const [extraPaymentsDropDown, setExtraPaymentsDropDown] = useState<ExtraPaymentDataType[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDataType | null>(null);
    const [selectedExtraPayments, setSelectedExtraPayments] = useState<ExtraPaymentDataType[]>([]);
    const [selectedExtraPaymentsIds, setSelectedExtraPaymentsIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [duePrice, setDueTotalPrice] = useState(0);

    const fetchData = async () => {
        try {
            const [invoicesRes, extraPaymentsRes] = await Promise.all([
                getInvoiceData(1, 100),
                getExtraPaymentData(),
            ]);
            if (invoicesRes.success) setInvoices(invoicesRes.invoices);
            if (extraPaymentsRes.success) {
                setExtraPaymentsDropDown(extraPaymentsRes.extraPayments);
                setInitExtraPayments(extraPaymentsRes.extraPayments);
            }
        } catch (error) {
            console.log("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        calculateTotalPrice()
    }, [selectedExtraPayments]);

    useEffect(() => {
        if (selectedInvoice?.extraPayment && selectedInvoice?.extraPayment?.length > 0) {
            const exPayment: number[] = selectedInvoice.extraPayment
            setExtraPaymentsDropDown(initExtraPayments.filter(i => !exPayment.includes(i.id)));
        }
    }, [selectedInvoice])

    const calculateTotalPrice = () => {
        const newPaymentsTotal = selectedExtraPayments.reduce(
            (sum, payment) => sum + Number(payment.amount),
            0
        );

        if (selectedInvoice) {
            const initialTotalPrice = selectedInvoice.totalPrice || 0;
            const initialDueAmount = selectedInvoice.dueAmount || 0;

            setTotalPrice(initialTotalPrice + newPaymentsTotal);
            setDueTotalPrice(initialDueAmount + newPaymentsTotal);
        } else {
            setTotalPrice(newPaymentsTotal);
            setDueTotalPrice(newPaymentsTotal);
        }
    };

    const removeExtraPayment = (id: number) => {
        const newSelectedExtraPaymentsId = selectedExtraPaymentsIds.filter(items => items !== id)
        setSelectedExtraPaymentsIds(newSelectedExtraPaymentsId)
        const newSelectedExtraPayments = selectedExtraPayments.filter(item => item.id !== id)
        setSelectedExtraPayments(newSelectedExtraPayments)
        const removeItem = selectedExtraPayments.filter(item => item.id === id)[0]
        setExtraPaymentsDropDown([...extraPaymentsDropDown, removeItem])
        setTotalPrice(totalPrice - Number(removeItem.amount || 0))
        setDueTotalPrice(duePrice - Number(removeItem.amount || 0))
    }

    const handleSubmit = async (
        values: InvoiceType,
        { resetForm }: FormikHelpers<InvoiceType>
    ) => {
        try {
            if (selectedInvoice?.id) {
                const body = {
                    id: selectedInvoice.id,
                    newPaymentType: selectedExtraPaymentsIds,
                    total: totalPrice,
                    due: duePrice
                }

                const response = await updateInvoice(body);
                if (response.success) {
                    toast.success(response.message);
                    resetForm();
                    router.push('/admin/invoices')
                }
                else {
                    toast.error(response.message);
                    resetForm();
                    return;
                }
            }
        } catch (error) {
            toast.error("An error occurred while adding the invoice.");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Formik
            initialValues={selectedInvoice ? { ...addInvoiceInitialValues, ...selectedInvoice } : addInvoiceInitialValues}
            validationSchema={Yup.object({})}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography fontSize="12px">Select Invoice</Typography>
                            <Autocomplete
                                loading={isLoading}
                                options={invoices}
                                getOptionLabel={(option) =>
                                    `#INV-${option.id} - ${option.studentInfo?.firstName || ""} - ${option.packageInfo?.title || ""}`
                                }
                                value={selectedInvoice}
                                onChange={(event, newValue) => {
                                    setSelectedInvoice(newValue);
                                    setFieldValue('id', newValue ? newValue.id : '');
                                    if (newValue) {
                                        setDueTotalPrice(newValue.dueAmount);
                                        setTotalPrice(newValue.totalPrice);
                                    } else {
                                        setDueTotalPrice(0);
                                        setTotalPrice(0);
                                    }
                                }}
                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Select Invoice"
                                        size="small"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            {selectedInvoice && (
                                <Box
                                    sx={{
                                        borderWidth: 3,
                                        borderStyle: 'solid',
                                        borderColor: '#edeef0',
                                        borderRadius: 2,
                                        padding: 1,
                                        display: "flex",
                                        flexDirection: { xs: "column", md: "row" },
                                        justifyContent: "flex-start",
                                        gap: { xs: 1, md: 10 }
                                    }}
                                >
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                                        <Typography variant="body1">
                                            <b>Invoice Date:</b> {selectedInvoice.invoiceDate}
                                        </Typography>
                                        <Typography variant="body1">
                                            <b>Student:</b> {`${selectedInvoice.studentInfo?.firstName} ${selectedInvoice.studentInfo?.lastName}`}
                                        </Typography>
                                        <Typography variant="body1">
                                            <b>Branch:</b>{` ${selectedInvoice.branchInfo.title.EN}`}
                                        </Typography>
                                        <Typography variant="body1">
                                            <b>Package name:</b>{" "}
                                            {selectedInvoice.updatePackageId && selectedInvoice.updatePackage
                                                ? `${selectedInvoice.updatePackage.title}-(${selectedInvoice.updatePackage.id})`
                                                : `${selectedInvoice.packageInfo.title}-(${selectedInvoice.packageInfo.id})`}
                                        </Typography>
                                        <Typography variant="body1">
                                            <b>Package price</b>
                                            {selectedInvoice?.updatePackageId ? (
                                                <span className="text-blue-600 text-xs">(new package)</span>
                                            ) : (
                                                Number(selectedInvoice?.packagePriceUpdatePrice) !== 0 && (
                                                    <span className="text-green-600 text-xs">(has been updated)</span>
                                                )
                                            )}
                                            <span>: </span>
                                            {selectedInvoice?.updatePackageId
                                                ? `LKR ${selectedInvoice?.updatePackage?.priceInLkr?.toLocaleString('en-US')}`
                                                : `LKR ${(
                                                    Number(selectedInvoice.packageInfo?.priceInLkr || 0) -
                                                    Number(selectedInvoice.packagePriceUpdatePrice || 0)
                                                ).toLocaleString("en-US")}`}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                                        <Typography variant="body1">
                                            <b>Extra Payments:</b>
                                            {selectedInvoice.extraPaymentInfo && selectedInvoice.extraPaymentInfo.length > 0 ? (
                                                selectedInvoice.extraPaymentInfo.map((payment) => (
                                                    <div key={payment.id}>
                                                        {payment.title.EN} -  {`${'LKR'} ${payment.amount.toLocaleString('en-US')}`}
                                                    </div>
                                                ))
                                            ) : (
                                                <span> _</span>
                                            )}
                                        </Typography>
                                        <Typography variant="body1">
                                            <b>Discounts:</b>
                                            {selectedInvoice.discountInfo && selectedInvoice.discountInfo.length > 0 ? (
                                                selectedInvoice.discountInfo.map((discount) => (
                                                    <div key={discount.id}>
                                                        {discount.title.EN} -  {`${'LKR'} ${discount.amount.toLocaleString('en-US')}`}
                                                    </div>
                                                ))
                                            ) : (
                                                <span> _</span>
                                            )}
                                        </Typography>
                                        <Typography variant="body1">
                                            <b>Total Amount:</b> {selectedInvoice.currency} {totalPrice.toLocaleString("en-US")}
                                        </Typography>
                                        <Typography variant="body1">
                                            <b>Due Amount:</b> {selectedInvoice.currency} {`${duePrice.toLocaleString('en-US')}`}
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Typography variant="body1"><b>Status:</b></Typography>
                                            <Box
                                                sx={{
                                                    backgroundColor: selectedInvoice.statusInfo.color,
                                                    color: "#fff",
                                                    fontSize: "10px",
                                                    fontWeight: "bold",
                                                    textTransform: "none",
                                                    borderRadius: "20px",
                                                    padding: "3px 8px",
                                                }}
                                            >
                                                {selectedInvoice.statusInfo.title.EN}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                        {(extraPaymentsDropDown?.length > 0 || selectedExtraPayments?.length > 0) && (selectedInvoice) &&
                            <Grid item xs={12} md={6}>
                                <Typography fontSize="12px">Select Extra Payments</Typography>

                                {/* Dropdown to select Extra Payment */}
                                <FormControl fullWidth variant="outlined">
                                    <Select
                                        value={values.selectedExtraPayment}
                                        onChange={(e) => setFieldValue('selectedExtraPayment', e.target.value)}
                                        displayEmpty
                                        inputProps={{
                                            "aria-label": "Select Extra Payment",
                                        }}
                                        size="small"
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        {extraPaymentsDropDown.filter((item => !selectedExtraPaymentsIds.includes(item.id))).map((payment) => (
                                            <MenuItem key={payment.id} value={payment.id}>
                                                {payment.title.EN} - LKR {payment.amount.toLocaleString('en-US')}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Button to Add Extra Payment */}
                                <Button
                                    variant="outlined"
                                    sx={{
                                        marginTop: "8px",
                                        marginRight: "8px",
                                        marginBottom: "8px",
                                    }}
                                    size="small"
                                    onClick={() => {
                                        const id = Number(values?.selectedExtraPayment);
                                        const selectedItem = extraPaymentsDropDown.find(i => i.id === id);
                                        if (selectedItem) {
                                            setSelectedExtraPaymentsIds([...selectedExtraPaymentsIds, id]);
                                            setSelectedExtraPayments([...selectedExtraPayments, selectedItem]);
                                            setFieldValue('selectedExtraPayment', "");
                                            extraPaymentsDropDown && setExtraPaymentsDropDown(extraPaymentsDropDown.filter(i => i.id !== id))
                                        }
                                    }}
                                >
                                    Add extra payment
                                </Button>

                                {/* Display Added Extra Payments */}
                                <AddedExtraPayments
                                    selectedExtraPayments={selectedExtraPayments}
                                    selectedInvoice={selectedInvoice}
                                    totalPrice={totalPrice}
                                    removeExtraPayment={removeExtraPayment}
                                />
                            </Grid>}
                    </Grid>
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
                            disabled={isSubmitting || (!selectedInvoice) || selectedExtraPayments?.length === 0}
                            sx={{
                                backgroundColor: "#1976d2",
                                borderRadius: "5px",
                                textTransform: "none",
                                "&:hover": { backgroundColor: "#115293" },
                                width: "200px"
                            }}
                        >
                            {isSubmitting ? "Updating..." : "Update Invoice"}
                        </Button>
                    </DialogActions>
                </Form>
            )}
        </Formik>
    );
};

export default UpdateInvoice;
