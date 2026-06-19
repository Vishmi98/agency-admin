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

import { MainCommissionDataType, SubCommissionFormValues, SubCommissionType } from "../commission.types";
import { addSubCommissionInitialValues, addSubCommissionValidationSchema } from "../commission.utils";
import { addSubCommission } from "../service/commission.service";


const AddSubCommission = (props: SubCommissionFormValues) => {
    const { handleReload, mainCommissions, staffs } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCommission, setSelectedCommission] = useState<MainCommissionDataType | null>(null);

    const theme = useTheme();

    const handleSubmit = async (
        values: SubCommissionType,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            setIsLoading(true);
            const response = await addSubCommission(values);
            if (response.success) {
                toast.success(response.message);
                resetForm();
                handleReload();
                setSelectedCommission(null);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding sub commission");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Box sx={{ width: "100%", marginTop: -1 }}>
                <Formik
                    initialValues={addSubCommissionInitialValues}
                    validationSchema={addSubCommissionValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, setFieldValue, values }: FormikProps<SubCommissionType>) => (
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
                                    {/* Commission Selector */}
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Commission ID</Typography>
                                        <Autocomplete
                                            options={mainCommissions}
                                            getOptionLabel={(option) =>
                                                `${option.id} - INV ${option.invoiceId} - ${option?.studentDetails?.firstName}`
                                            }
                                            onChange={(event, value) => {
                                                if (value) {
                                                    setFieldValue("commissionId", value.id);
                                                    setFieldValue("amount", value.monthlyAmount / 12 || 0);
                                                    setFieldValue("staffId", value.staffId || "");
                                                    setSelectedCommission(value); // ✅ save selected commission
                                                } else {
                                                    setFieldValue("commissionId", "");
                                                    setFieldValue("amount", 0);
                                                    setFieldValue("staffId", "");
                                                    setSelectedCommission(null);
                                                }
                                            }}
                                            size="small"
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    placeholder="Search..."
                                                    fullWidth
                                                    error={touched.commissionId && Boolean(errors.commissionId)}
                                                    helperText={touched.commissionId && errors.commissionId}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* Month */}
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Month</Typography>
                                        <Field
                                            name="month"
                                            type="month"
                                            as="input"
                                            className="border p-1.5 w-full rounded-[5px]"
                                        />
                                        <ErrorMessage name="month" component="div" className="text-red-400 text-xs mt-1.5 pl-2" />
                                    </Grid>

                                    {/* Staff */}
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Staff ID</Typography>
                                        <Autocomplete
                                            options={staffs}
                                            getOptionLabel={(option) => option.fullName}
                                            onChange={(event, value) => {
                                                setFieldValue("staffId", value ? value.id : "");
                                            }}
                                            value={staffs.find((s) => s.id === values.staffId) || null} // show current selected staff
                                            size="small"
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    placeholder="Search..."
                                                    fullWidth
                                                    error={touched.staffId && Boolean(errors.staffId)}
                                                    helperText={touched.staffId && errors.staffId}
                                                />
                                            )}
                                        />
                                        <ErrorMessage name="staffId" component="div" className="text-red-400 text-xs mt-1.5 pl-2" />
                                    </Grid>
                                </Grid>
                                {/* ✅ Selected Commission Details */}
                                {selectedCommission && (
                                    <Box
                                        sx={{
                                            border: "1px solid #ddd",
                                            borderRadius: "8px",
                                            padding: "5px",
                                            marginTop: 1,
                                            backgroundColor: "#fafafa",
                                        }}>
                                        <Typography fontWeight="bold" fontSize="12px" marginTop={-0.5}>Commission Details</Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 5
                                            }}
                                        >
                                            <Box>
                                                <Typography fontSize="12px">Invoice ID: INV - {selectedCommission.invoiceId}</Typography>
                                                <Typography fontSize="12px">Student: {selectedCommission?.studentDetails?.firstName} {selectedCommission?.studentDetails?.lastName}</Typography>
                                                <Typography fontSize="12px">Staff: {selectedCommission?.staffDetails?.firstName} {selectedCommission?.staffDetails?.lastName}</Typography>
                                                <Typography fontSize="12px">Status: {selectedCommission.status}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography fontSize="12px">Amount: LKR {selectedCommission.amount.toFixed(2)}</Typography>
                                                <Typography fontSize="12px">Percentage: {selectedCommission.percentage.toFixed(1)}%</Typography>
                                                <Typography fontSize="12px">Paid Amount: LKR {selectedCommission.paidAmount.toFixed(2)}</Typography>
                                                <Typography fontSize="12px">Monthly Amount: LKR {selectedCommission.monthlyAmount.toFixed(2)}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}

                                {/* Submit Button */}
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
                    )}
                </Formik>
            </Box>
        </>
    );
};

export default AddSubCommission;
