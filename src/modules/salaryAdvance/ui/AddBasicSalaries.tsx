"use client"

import React, { useState } from 'react'
import { Box, Button, Grid, Typography, useTheme } from '@mui/material'
import { Form, Formik, FormikProps } from 'formik';
import { toast } from 'react-toastify';

import { addBasicSalaryInitialValues, addBasicSalaryValidationSchema } from '../salaryAdvance.utils';
import { AddBasicSalaryFormValues, BasicSalaryType } from '../salaryAdvance.types';
import { addBasicSalary } from '../service/salaryAdvance.service';

import TextBox from '@/components/TextBox';


const AddBasicSalaries = (props: AddBasicSalaryFormValues) => {
  const { handleReload } = props;

  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    values: BasicSalaryType,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      setIsLoading(true);
      const response = await addBasicSalary(values);
      if (response.success) {
        toast.success(response.message);
        resetForm();
        handleReload();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred while adding the basic salary");
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
        Enter Basic Salary
      </Typography>
      <Formik
        initialValues={addBasicSalaryInitialValues}
        validationSchema={addBasicSalaryValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors, isSubmitting }: FormikProps<BasicSalaryType>) => (
          <Form>
            <Box
              sx={{
                maxHeight: "400px",
                overflowY: "auto",
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12} md={4}>
                  <Typography fontSize="12px">Role</Typography>
                  <TextBox
                    name="role"
                    label=""
                    as="input"
                    type="number"
                    fullWidth
                    error={touched.role && !!errors.role}
                    helperText={touched.role && errors.role}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography fontSize="12px">Role Name</Typography>
                  <TextBox
                    name="title"
                    label=""
                    as="input"
                    type="text"
                    fullWidth
                    error={touched.title && !!errors.title}
                    helperText={touched.title && errors.title}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography fontSize="12px">Amount</Typography>
                  <TextBox
                    name="basicSalary"
                    label=""
                    as="input"
                    type="number"
                    fullWidth
                    error={touched.basicSalary && !!errors.basicSalary}
                    helperText={touched.basicSalary && errors.basicSalary}
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
                {isLoading ? "Adding..." : "Add Basic Salary"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default AddBasicSalaries