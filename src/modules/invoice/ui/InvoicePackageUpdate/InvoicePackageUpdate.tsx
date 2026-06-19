"use client";

import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
    Autocomplete,
    Box,
    Button,
    DialogActions,
    Grid,
    Stack,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import { toast } from "react-toastify";

import { InvoiceDataType } from "../../invoice.types";
import { getInvoicesNotUpdatePackage, updateInvoicePackage } from "../../services/invoice.services";
import { addInvoiceInitialValues } from "../../invoice.utils";

import { getPackagesData } from "@/modules/packages/services/packages.service";
import { PackageDataType } from "@/modules/packages/package.types";


const InvoicePackageUpdate = () => {
    const theme = useTheme();
    const router = useRouter();

    const [invoices, setInvoices] = useState<InvoiceDataType[]>([]);
    const [packagesDropDown, setPackagesDropDown] = useState<PackageDataType[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDataType | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<PackageDataType | null>(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [duePrice, setDuePrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [priceDifference, setPriceDifference] = useState(0);

    // Fetch invoices and packages
    const fetchData = async () => {
        try {
            const [invoicesRes, packagesRes] = await Promise.all([
                getInvoicesNotUpdatePackage(1, 1000),
                getPackagesData(1, 1000),
            ]);

            if (invoicesRes.success) setInvoices(invoicesRes.invoices);
            if (packagesRes.success) setPackagesDropDown(packagesRes.packages);
        } catch (error) {
            console.log("Error fetching data", error);
            toast.error("Failed to load invoices or packages.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Calculate total and due price based on selected invoice and package
    const calculateTotalAndDue = (invoice: InvoiceDataType, pkg: PackageDataType | null) => {
        if (!invoice) return;

        const existingPrice = Number(invoice.packageInfo.priceInLkr) - Number(invoice.packagePriceUpdatePrice);
        const newPrice = pkg ? Number(pkg.priceInLkr) : existingPrice;

        // Calculate how much MORE the user has to pay
        const priceIncrease = Number((newPrice - existingPrice).toFixed(2));

        const newTotal = Number((invoice.totalPrice + priceIncrease).toFixed(2));
        const newDue = Number((invoice.dueAmount + priceIncrease).toFixed(2));

        setPriceDifference(priceIncrease);
        setTotalPrice(newTotal);
        setDuePrice(newDue);

        console.log("def", priceIncrease);
        console.log("tot", newTotal);
        console.log("due", newDue);
    };

    // Recalculate whenever invoice or package changes
    useEffect(() => {
        if (selectedInvoice) {
            calculateTotalAndDue(selectedInvoice, selectedPackage);
        } else {
            setTotalPrice(0);
            setDuePrice(0);
        }
    }, [selectedInvoice, selectedPackage]);

    const handleSubmit = async (values: any, { resetForm }: FormikHelpers<any>) => {
        if (!selectedInvoice || !selectedPackage) {
            toast.error("Please select both invoice and package.");
            return;
        }

        try {
            setIsLoading(true);

            const body = {
                id: selectedInvoice.id,
                updatePackageId: selectedPackage.id,
                total: totalPrice,
                due: duePrice,
                difference: priceDifference,
            };

            const response = await updateInvoicePackage(body);
            if (response.success) {
                toast.success(response.message);
                resetForm();
                router.push("/admin/invoices");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while updating the invoice.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Formik
            initialValues={addInvoiceInitialValues}
            validationSchema={Yup.object({})}
            enableReinitialize
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form>
                    <Grid container spacing={2}>
                        {/* Select Invoice */}
                        <Grid item xs={12} md={6}>
                            <Typography fontSize="12px">Select Invoice</Typography>
                            <Autocomplete
                                loading={isLoading}
                                options={invoices}
                                getOptionLabel={(option) =>
                                    `#INV-${option.id} - ${option.studentInfo?.firstName || ""} - ${option.packageInfo?.title || ""
                                    }`
                                }
                                value={selectedInvoice}
                                onChange={(event, newValue) => {
                                    setSelectedInvoice(newValue);
                                    setSelectedPackage(null); // reset selected package
                                    setFieldValue("id", newValue ? newValue.id : "");
                                }}
                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="Select Invoice" size="small" fullWidth />
                                )}
                            />
                        </Grid>

                        {/* Invoice Details */}
                        {selectedInvoice && (
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        borderWidth: 3,
                                        borderStyle: "solid",
                                        borderColor: "#edeef0",
                                        borderRadius: 2,
                                        padding: 2,
                                        display: "flex",
                                        flexDirection: { xs: "column", md: "row" },
                                        justifyContent: "space-between",
                                        gap: 5,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: { xs: "100%", lg: "50%" },
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            gap: 1,
                                        }}
                                    >
                                        <Typography variant="body1">
                                            <b>Invoice Date:</b> {selectedInvoice.invoiceDate}
                                        </Typography>
                                        <Typography variant="body1">
                                            <b>Student:</b> {`${selectedInvoice.studentInfo?.firstName} ${selectedInvoice.studentInfo?.lastName}`}
                                        </Typography>
                                        <Typography variant="body1">
                                            <b>Branch:</b> {` ${selectedInvoice.branchInfo.title.EN}`}
                                        </Typography>
                                        <Typography variant="body1">
                                            <b>Package name:</b> {`${selectedInvoice.packageInfo.title}-(${selectedInvoice.packageInfo.id})`}
                                        </Typography>
                                        <Typography variant="body1">
                                            <div>
                                                <b>Package price </b>

                                                {Number(selectedInvoice?.packagePriceUpdatePrice) !== 0 && (
                                                    <span className="text-green-600">{'(has been updated )'}</span>
                                                )}

                                                <span>:</span>

                                                <span>
                                                    {" "}
                                                    LKR{" "}
                                                    {(
                                                        Number(selectedInvoice.packageInfo?.priceInLkr || 0) -
                                                        Number(selectedInvoice.packagePriceUpdatePrice || 0)
                                                    ).toLocaleString("en-US")}
                                                </span>
                                            </div>
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            width: { xs: "100%", lg: "50%" },
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            gap: 1,
                                        }}
                                    >
                                        <Typography variant="body1">
                                            <b>Extra Payments:</b>
                                            {selectedInvoice.extraPaymentInfo && selectedInvoice.extraPaymentInfo.length > 0 ? (
                                                selectedInvoice.extraPaymentInfo.map((payment) => (
                                                    <div key={payment.id}>
                                                        {payment.title.EN} - {`LKR ${payment.amount.toLocaleString("en-US")}`}
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
                                                        {discount.title.EN} - {`LKR ${discount.amount.toLocaleString("en-US")}`}
                                                    </div>
                                                ))
                                            ) : (
                                                <span> _</span>
                                            )}
                                        </Typography>
                                        <Typography variant="body1">
                                            <b>Total Amount:</b> {selectedInvoice.currency} {selectedInvoice.totalPrice.toLocaleString("en-US")}
                                        </Typography>
                                        <Typography variant="body1">
                                            <b>Due Amount:</b> {selectedInvoice.currency} {selectedInvoice.dueAmount.toLocaleString("en-US")}
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
                            </Grid>
                        )}

                        {/* Select Package */}
                        {selectedInvoice && (
                            <Grid item xs={12} md={6}>
                                <Typography fontSize="12px">Select Package</Typography>
                                <Autocomplete
                                    options={packagesDropDown}
                                    getOptionLabel={(option) => `${option.id} - ${option.title} - ${option.priceInLkr}`}
                                    loading={isLoading}
                                    value={selectedPackage}
                                    onChange={(event, value) => {
                                        setSelectedPackage(value);
                                        setFieldValue("packageId", value ? value.id : "");
                                    }}
                                    renderInput={(params) => <TextField {...params} placeholder="Search Package..." size="small" fullWidth />}
                                />

                                {selectedPackage && (
                                    <Box sx={{ mt: 2, border: "1px solid #ccc", borderRadius: 2, padding: 2, backgroundColor: "#f9f9f9" }}>
                                        <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                                            Package Update Summary
                                        </Typography>
                                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                            <Typography>Existing package Price (LKR)</Typography>
                                            <Typography>
                                                {(
                                                    Number(selectedInvoice.packageInfo?.priceInLkr || 0) -
                                                    Number(selectedInvoice.packagePriceUpdatePrice || 0)
                                                ).toLocaleString("en-US")}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                            <Typography>New Package Price (LKR)</Typography>
                                            <Typography>{Number(selectedPackage.priceInLkr).toLocaleString("en-US")}</Typography>
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            mb={0.5}
                                            color={(
                                                Number(selectedPackage.priceInLkr) -
                                                (Number(selectedInvoice.packageInfo?.priceInLkr || 0) -
                                                    Number(selectedInvoice.packagePriceUpdatePrice || 0))
                                            ) > 0 ? "green" : "red"}
                                        >
                                            <Typography>Difference (LKR)</Typography>
                                            <Typography>
                                                {(
                                                    Number(selectedPackage.priceInLkr) -
                                                    (Number(selectedInvoice.packageInfo?.priceInLkr || 0) -
                                                        Number(selectedInvoice.packagePriceUpdatePrice || 0))
                                                ).toLocaleString("en-US")}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                            <Typography>New Total Price (LKR)</Typography>
                                            <Typography>{totalPrice.toLocaleString("en-US")}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography>New Due Amount (LKR)</Typography>
                                            <Typography>{duePrice.toLocaleString("en-US")}</Typography>
                                        </Stack>
                                    </Box>
                                )}
                            </Grid>
                        )}
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
                            disabled={isSubmitting || (!selectedInvoice) || (!selectedPackage)}
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

export default InvoicePackageUpdate;
