"use client";

import { Box, Button, Grid, useTheme, Typography } from '@mui/material';
import { Formik, Form, FormikProps } from 'formik';

import { searchSalariesInitialValues, searchSalariesValidationSchema } from '../salaryAdvance.utils';
import { SearchSalariesFormValues } from '../salaryAdvance.types';

import TextBox from '@/components/TextBox';
import { SearchAttendanceProps } from '@/modules/attendances/attendance.types';


const SearchSalaries = ({ onSearch }: SearchAttendanceProps) => {
    const theme = useTheme();

    return (
        <Formik
            initialValues={searchSalariesInitialValues}
            validationSchema={searchSalariesValidationSchema}
            onSubmit={(values) => {
                onSearch(values.month);
            }}
        >
            {(formik: FormikProps<SearchSalariesFormValues>) => (
                <Form>
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            paddingX: "10px",
                            paddingY: "10px",
                            borderRadius: "5px",
                            width: "100%",
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 3, width: "100%", marginTop: -1 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={5}>
                                    <Typography fontSize="12px">Month</Typography>
                                    <TextBox
                                        name="month"
                                        label=""
                                        as="input"
                                        type="month"
                                        fullWidth
                                        error={formik.touched.month && !!formik.errors.month}
                                        helperText={formik.touched.month && formik.errors.month}
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
                        </Box>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default SearchSalaries;
