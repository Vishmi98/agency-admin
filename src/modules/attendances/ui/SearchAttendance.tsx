"use client";

import { Box, Button, Grid, useTheme, Typography } from '@mui/material';
import { Formik, Form, FormikProps } from 'formik';

import { searchAttendanceInitialValues, searchAttendanceValidationSchema } from '../attendance.utils';
import { SearchAttendanceFormValues, SearchAttendanceProps } from '../attendance.types';

import TextBox from '@/components/TextBox';


const SearchAttendance = ({ onSearch }: SearchAttendanceProps) => {
    const theme = useTheme();

    return (
        <Box sx={{ width: "100%", marginTop: 0 }}>
            <Formik
                initialValues={searchAttendanceInitialValues}
                validationSchema={searchAttendanceValidationSchema}
                onSubmit={(values) => {
                    onSearch(values.date);
                }}
            >
                {(formik: FormikProps<SearchAttendanceFormValues>) => (
                    <Form>
                        <Grid container spacing={1} marginTop={-2}>
                            <Grid item xs={6} marginTop={0}>
                                <Typography fontSize="12px">Date</Typography>
                                <TextBox
                                    name="date"
                                    label=""
                                    as="input"
                                    type="date"
                                    fullWidth
                                    error={formik.touched.date && !!formik.errors.date}
                                    helperText={formik.touched.date && formik.errors.date}
                                />
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <Box
                                    sx={{
                                        position: "sticky",
                                        bottom: 0,
                                        backgroundColor: theme.palette.background.paper,
                                        zIndex: 1000,
                                        width: "100%",
                                        marginTop: 2.5,
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            backgroundColor: "#1976d2",
                                            borderRadius: "5px",
                                            textTransform: "none",
                                            "&:hover": { backgroundColor: "#115293" },
                                            width: "100%",
                                        }}
                                    >
                                        Search
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Box >
    );
};

export default SearchAttendance;
