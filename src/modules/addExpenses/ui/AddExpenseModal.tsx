"use client";

import React, { FC, useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
    useTheme,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';

import { ExpenseType } from '../expenses.types';
import { createExpense } from '../services/expenses.services';
import { addExpenseInitialValues, addExpenseValidationSchema } from '../expenses.utils';

import TextBox from '@/components/TextBox';
import { getExpensesTypesData } from '@/modules/expensesTypes/services/expenseTypes.services';
import { DropdownType } from '@/type/common.types';
import { AddModalProps } from '@/modules/countries/countries.types';
import { getCookieUser } from '@/utils/cookie.util';
import { getBranches } from '@/modules/staff/services/staff.services';


const AddExpenseModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const theme = useTheme();

    const user = getCookieUser();

    const [branches, setBranches] = useState<DropdownType[]>([]);
    const [expenseTypes, setExpenseTypes] = useState<DropdownType[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchExpenseTypes = async () => {
        try {
            const response = await getExpensesTypesData();
            if (response.success) {
                setExpenseTypes(response.expenseTypes);
            } else {
                toast.error(response.message || "Failed to fetch expenses types");
            }
        } catch (error) {
            toast.error("Error fetching expenses types");
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await getBranches();
            if (response.success) {
                setBranches(response.branches);
            } else {
                toast.error(response.message || "Failed to fetch branches");
            }
        } catch (error) {
            toast.error("Error fetching branches");
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchExpenseTypes();
            fetchBranches();
        }
    }, [isOpen]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleSubmit = async (
        values: ExpenseType,
        { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        try {
            setIsLoading(true);

            values.createdBy = user && user.id ? Number(user.id) : 0;
            const formData = new FormData();
            formData.append('date', String(values.date));
            formData.append('expenseType', String(values.expenseType));
            formData.append('amount', String(values.amount));
            formData.append('createdBy', String(values.createdBy));
            formData.append('smallDescription', String(values.smallDescription));
            formData.append('branchId', String(values.branchId));

            if (selectedImage) formData.append('image', selectedImage);

            const response = await createExpense(formData);

            if (response.success) {
                toast.success(response.message || "Expense added successfully!");
                resetForm();
                setSelectedImage(null);
                handleReload();
                onClose();
            } else {
                toast.error(response.message || "Failed to add expense.");
            }
        } catch (error) {
            toast.error("Error uploading expense. Please try again.");
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };

    return (
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
                    Add New Expense
                </DialogTitle>
                <CloseIcon sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
            </Box>
            <Formik
                initialValues={addExpenseInitialValues}
                validationSchema={addExpenseValidationSchema}
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
                                <Grid container spacing={2}>
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
                                        <Typography fontSize="12px">Expense Types</Typography>
                                        <Field
                                            as="select"
                                            name="expenseType"
                                            className="border p-2 w-full"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                const selectedId = Number(e.target.value);
                                                setFieldValue('expenseType', selectedId);
                                            }}
                                        >
                                            <option value="">Select Expense Type</option>
                                            {expenseTypes?.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.title["EN"]}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="expenseType" component="div" className="text-red-300 text-xs pl-4 pt-2" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography fontSize="12px">Description</Typography>
                                        <TextBox
                                            name="smallDescription"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            error={touched.smallDescription && !!errors.smallDescription}
                                            helperText={
                                                touched.smallDescription && errors.smallDescription
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Amount (LKR)</Typography>
                                        <TextBox
                                            name="amount"
                                            label=""
                                            as="input"
                                            type="text"
                                            fullWidth
                                            error={touched.amount && !!errors.amount}
                                            helperText={touched.amount && errors.amount}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Branch</Typography>
                                        <Field
                                            as="select"
                                            name="branchId"
                                            className="border p-2 w-full"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                setFieldValue('branchId', Number(e.target.value));
                                            }}
                                        >
                                            <option value="">Select Branch</option>
                                            {branches?.map((branch) => (
                                                <option key={branch.id} value={branch.id}>
                                                    {branch.title["EN"]}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="branchId" component="div" className="text-red-300 text-xs pl-4 pt-2" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography fontSize="12px">Upload Image</Typography>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.png,.docx,.jpeg"
                                            onChange={handleImageChange}
                                            className="border p-2 w-full rounded-md border-gray-300 mb-3"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
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
                                disabled={isSubmitting || isLoading}
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
    );
};

export default AddExpenseModal;
