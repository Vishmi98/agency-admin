"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Autocomplete,
    Button,
    DialogActions,
    FormControl,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { Formik, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";

import AddedExtraPayments from "./AddedExtraPayments";
import PackageDetails from "../PackageDetails";
import StudentDetails from "../StudentDetails";
import { InvoiceType } from "../../invoice.types";
import { createInvoice, getStudentNotHaveInvoice } from "../../services/invoice.services";
import { addInvoiceInitialValues, addInvoiceValidationSchema } from "../../invoice.utils";

import { PackageDataType } from "@/modules/packages/package.types";
import { StudentDataType } from "@/modules/student/student.types";
import { getPackagesData } from "@/modules/packages/services/packages.service";
import { getExtraPaymentData } from "@/modules/extraPayment/services/extraPayment.services";
import { ExtraPaymentDataType } from "@/modules/extraPayment/extraPayment.types";
import { StaffDataType } from "@/modules/staff/staff.types";
import { getBranches, getStaffData } from "@/modules/staff/services/staff.services";
import { getDiscountData } from "@/modules/discount/services/discount.services";
import TextBox from "@/components/TextBox";
import { DropdownType } from "@/type/common.types";


const AddInvoice = () => {
    const theme = useTheme();

    const [packages, setPackages] = useState<PackageDataType[]>([]);
    const [students, setStudents] = useState<StudentDataType[]>([]);
    const [staffs, setStaffs] = useState<StaffDataType[]>([]);
    const [extraPayments, setExtraPayments] = useState<ExtraPaymentDataType[]>([]);
    const [selectedExtraPayments, setSelectedExtraPayments] = useState<ExtraPaymentDataType[]>([]);
    const [selectedExtraPaymentsIds, setSelectedExtraPaymentsIds] = useState<number[]>([]);
    const [discounts, setDiscounts] = useState<ExtraPaymentDataType[]>([]);
    const [selectedDiscounts, setSelectedDiscounts] = useState<ExtraPaymentDataType[]>([]);
    const [selectedDiscountsIds, setSelectedDiscountsIds] = useState<number[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<PackageDataType | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<StudentDataType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [branches, setBranches] = useState<DropdownType[]>([]);

    const router = useRouter();

    const fetchData = async () => {
        try {
            const [packagesRes, studentsRes, extraPaymentsRes, staffsRes, discountsRes, branchesRes] = await Promise.all([
                getPackagesData(1, 100),
                getStudentNotHaveInvoice(1, 100),
                getExtraPaymentData(),
                getStaffData(1, 100),
                getDiscountData(),
                getBranches()
            ]);
            if (packagesRes.success) setPackages(packagesRes.packages);
            if (studentsRes.success) setStudents(studentsRes.students);
            if (extraPaymentsRes.success) setExtraPayments(extraPaymentsRes.extraPayments);
            if (staffsRes.success) setStaffs(staffsRes.staffs);
            if (discountsRes.success) setDiscounts(discountsRes.discounts);
            if (branchesRes.success) setBranches(branchesRes.branches);
        } catch (error) {
            console.log("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (
        values: InvoiceType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            setIsLoading(true);
            values.extraPayment = selectedExtraPaymentsIds
            values.discount = selectedDiscountsIds

            values.totalPrice = totalPrice
            const response = await createInvoice(values);
            if (!response.success) {
                toast.error(response.message);
                return;
            }
            toast.success(response.message);
            resetForm();
            router.push('/admin/invoices')
        } catch (error) {
            toast.error("An error occurred while adding the invoice.");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTotalPrice = () => {
        if (selectedPackage) {
            const packagePriceLKR = Number(selectedPackage.priceInLkr) || 0;
            let totalExtraPayment = 0
            selectedExtraPayments.length > 0 && selectedExtraPayments.map(payment => {
                totalExtraPayment = totalExtraPayment + Number(payment.amount)
            })
            let totalDiscount = 0
            selectedDiscounts.length > 0 && selectedDiscounts.map(discount => {
                totalDiscount = totalDiscount + Number(discount.amount)
            })
            setTotalPrice(totalExtraPayment + packagePriceLKR - totalDiscount);
        }
    };

    const removeExtraPayment = (id: number) => {
        const newSelectedExtraPaymentsId = selectedExtraPaymentsIds.filter(items => items !== id)
        setSelectedExtraPaymentsIds(newSelectedExtraPaymentsId)
        const newSelectedExtraPayments = selectedExtraPayments.filter(item => item.id !== id)
        setSelectedExtraPayments(newSelectedExtraPayments)
    }

    const removeDiscount = (id: number) => {
        const newSelectedDiscountsId = selectedDiscountsIds.filter(items => items !== id)
        setSelectedDiscountsIds(newSelectedDiscountsId)
        const newSelectedDiscounts = selectedDiscounts.filter(item => item.id !== id)
        setSelectedDiscounts(newSelectedDiscounts)
    }

    return (
        <Formik
            initialValues={addInvoiceInitialValues}
            validationSchema={addInvoiceValidationSchema}
            onSubmit={handleSubmit}
        >
            {({ touched, errors, isSubmitting, setFieldValue, values }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={8}>
                            <Typography fontSize="12px">Select Package</Typography>
                            <Autocomplete
                                options={packages}
                                getOptionLabel={(option) => option.title}
                                loading={isLoading}
                                onChange={(event, value) => {
                                    setFieldValue('packageId', value ? value.id : '');
                                    setSelectedPackage(value);
                                }}
                                size="small"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        placeholder="Search Package..."
                                        fullWidth
                                        error={touched.packageId && Boolean(errors.packageId)}
                                        helperText={touched.packageId && errors.packageId}
                                    />
                                )}
                            />
                            <ErrorMessage name="packageId" component="div" className="text-red-400 text-xs pl-2 pt-2" />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Typography fontSize="12px">Date</Typography>
                            <TextBox
                                name="invoiceDate"
                                label=""
                                as="input"
                                type="date"
                                fullWidth
                                error={touched.invoiceDate && !!errors.invoiceDate}
                                helperText={touched.invoiceDate && errors.invoiceDate}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Typography fontSize="12px">Select Student</Typography>
                            <Autocomplete
                                options={students}
                                getOptionLabel={(option) => option.fullName}
                                loading={isLoading}
                                onChange={(event, value) => {
                                    setFieldValue('studentId', value ? value.id : '');
                                    setSelectedStudent(value);
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
                            <ErrorMessage name="studentId" component="div" className="text-red-400 text-xs pl-2 pt-2" />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Typography fontSize="12px">Select Staff Member</Typography>
                            <Autocomplete
                                options={staffs}
                                getOptionLabel={(option) => option.fullName}
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
                            <ErrorMessage name="staffId" component="div" className="text-red-400 text-xs pl-2 pt-2" />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Typography fontSize="12px">Branch</Typography>
                            <FormControl fullWidth variant="outlined">
                                <Select
                                    value={values.branchId}
                                    onChange={(e) => setFieldValue('branchId', e.target.value)}
                                    displayEmpty
                                    inputProps={{
                                        "aria-label": "Select Branch",
                                    }}
                                    size="small"
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    {branches.map((branch) => (
                                        <MenuItem key={branch.id} value={branch.id}>
                                            {branch.title.EN}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <ErrorMessage
                                name="branchId"
                                component="div"
                                className="text-red-400 text-xs pl-2 pt-2"
                            />
                        </Grid>
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
                                    {extraPayments.filter((item => !selectedExtraPaymentsIds.includes(item.id))).map((payment) => (
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
                                    const id = Number(values?.selectedExtraPayment)
                                    const selectedItem = extraPayments.filter(i => i.id === id)
                                    setSelectedExtraPaymentsIds([...selectedExtraPaymentsIds, id])
                                    selectedItem?.length > 0 && setSelectedExtraPayments([...selectedExtraPayments, selectedItem[0]])
                                    setFieldValue('selectedExtraPayment', "")
                                }}
                            >
                                Add extra payment
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography fontSize="12px">Select Discounts</Typography>

                            {/* Dropdown to select discounts */}
                            <FormControl fullWidth variant="outlined">
                                <Select
                                    value={values.selectedDiscount}
                                    onChange={(e) => setFieldValue('selectedDiscount', e.target.value)}
                                    displayEmpty
                                    inputProps={{
                                        "aria-label": "Select Discounts",
                                    }}
                                    size="small"
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    {discounts.filter((item => !selectedDiscountsIds.includes(item.id))).map((discount) => (
                                        <MenuItem key={discount.id} value={discount.id}>
                                            {discount.title.EN} - LKR {discount.amount.toLocaleString('en-US')}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Button to Add discounts */}
                            <Button
                                variant="outlined"
                                sx={{
                                    marginTop: "8px",
                                    marginRight: "8px",
                                    marginBottom: "8px",
                                }}
                                size="small"
                                onClick={() => {
                                    const id = Number(values?.selectedDiscount)
                                    const selectedItem = discounts.filter(i => i.id === id)
                                    setSelectedDiscountsIds([...selectedDiscountsIds, id])
                                    selectedItem?.length > 0 && setSelectedDiscounts([...selectedDiscounts, selectedItem[0]])
                                    setFieldValue('selectedDiscount', "")
                                }}
                            >
                                Add discount
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {/* Display Added Extra Payments */}
                            <AddedExtraPayments
                                selectedExtraPayments={selectedExtraPayments}
                                selectedDiscounts={selectedDiscounts}
                                totalPrice={totalPrice}
                                selectedPackagePrice={selectedPackage ? Number(selectedPackage.priceInLkr) : undefined}
                                calculateTotalPrice={calculateTotalPrice}
                                removeExtraPayment={removeExtraPayment}
                                removeDiscount={removeDiscount}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} width={"0%"} mt={2}>
                            {values?.packageId && selectedPackage && (
                                <PackageDetails package_={selectedPackage} />
                            )}
                            {values?.studentId && selectedStudent && (
                                <StudentDetails student={selectedStudent} />
                            )}
                        </Grid>
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
                            disabled={isSubmitting}
                            sx={{
                                backgroundColor: "#1976d2",
                                borderRadius: "5px",
                                textTransform: "none",
                                "&:hover": { backgroundColor: "#115293" },
                                width: "200px"
                            }}
                        >
                            Create Invoice
                        </Button>
                    </DialogActions>
                </Form>
            )}
        </Formik>
    );
};

export default AddInvoice;
