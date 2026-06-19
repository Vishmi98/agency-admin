"use client";

import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Box,
    useTheme,
    Typography,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from "formik";

import { UpdatePackageModalProps } from "../package.types";
import { updatePackageValidationSchema } from "../package.utils";


const UpdatePackageModal: React.FC<UpdatePackageModalProps> = ({
    open,
    onClose,
    onSubmit,
    packageData,
}) => {
    const theme = useTheme();

    const initialValues = {
        costInLkr: packageData?.costInLkr || 0,
        priceInLkr: packageData?.priceInLkr || 0,
    };

    return (
        <Dialog
            open={open}
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
                    Update Package
                </DialogTitle>
                <CloseIcon
                    data-testid="CloseIcon"
                    sx={{ width: 15, height: 15, marginRight: 3, cursor: "pointer" }}
                    onClick={onClose}
                />
            </Box>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={updatePackageValidationSchema}
                onSubmit={(values) => {
                    if (!packageData) return;
                    onSubmit({
                        id: packageData.id,
                        costInLkr: values.costInLkr,
                        priceInLkr: values.priceInLkr,
                    });
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur }) => (
                    <Form>
                        <DialogContent
                            sx={{
                                padding: "10px 24px",
                                maxHeight: "400px",
                                overflowY: "auto",
                                backgroundColor: theme.palette.background.paper,
                            }}
                        >
                            <Grid container spacing={2} my={1}>
                                <Grid item xs={12} md={6}>
                                    <Typography fontSize="12px">Cost (LKR)</Typography>
                                    <TextField
                                        name="costInLkr"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        value={values.costInLkr}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.costInLkr && Boolean(errors.costInLkr)}
                                        helperText={touched.costInLkr && errors.costInLkr}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography fontSize="12px">Price (LKR)</Typography>
                                    <TextField
                                        name="priceInLkr"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        value={values.priceInLkr}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.priceInLkr && Boolean(errors.priceInLkr)}
                                        helperText={touched.priceInLkr && errors.priceInLkr}
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
    );
};

export default UpdatePackageModal;
