"use client"

import React, { useState } from 'react'
import { Autocomplete, Box, Button, Grid, TextField, Typography, useTheme } from '@mui/material'
import { ErrorMessage, Form, Formik, FormikProps } from 'formik';
import { toast } from 'react-toastify';

import { AddCommissionFormValues, CommissionType } from '../commissions.types';
import { addCommission } from '../service/commissions.service';
import { addCommissionInitialValues, addCommissionValidationSchema } from '../commissions.utils';

import TextBox from '@/components/TextBox';
import { ROLES } from '@/constants/data';


const AddCommissions = (props: AddCommissionFormValues) => {
  const { handleReload } = props;
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    values: CommissionType,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      setIsLoading(true);
      const response = await addCommission(values);
      if (response.success) {
        toast.success(response.message);
        resetForm();
        handleReload();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred while adding the commission");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          color: theme.palette.text.primary,
          marginBottom: 2
        }}
      >
        Enter Commission
      </Typography>
      <Formik
        initialValues={addCommissionInitialValues}
        validationSchema={addCommissionValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors, isSubmitting, setFieldValue }: FormikProps<CommissionType>) => (
          <Form>
            <Box
              sx={{
                maxHeight: "400px",
                overflowY: "auto",
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <Typography fontSize="12px">Select Role</Typography>
                  <Autocomplete
                    options={ROLES}
                    getOptionLabel={(option) => option.label}
                    onChange={(e, value) => setFieldValue("role", value?.id || '')}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search Role..."
                        error={touched.role && !!errors.role}
                        helperText={touched.role && errors.role}
                      />
                    )}
                  />
                  <ErrorMessage name="role" component="div" className="text-red-400 text-xs pl-2 pt-2" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography fontSize="12px">Amount</Typography>
                  <TextBox
                    name="amount"
                    label=""
                    as="input"
                    type="number"
                    fullWidth
                    error={touched.amount && !!errors.amount}
                    helperText={touched.amount && errors.amount}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: "8px",
                backgroundColor: theme.palette.background.paper,
                marginTop: 2
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
                disabled={isSubmitting || isLoading}
                sx={{
                  backgroundColor: "#1976d2",
                  borderRadius: "5px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#115293" },
                  width: "200px"
                }}
              >
                Add Commission
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default AddCommissions