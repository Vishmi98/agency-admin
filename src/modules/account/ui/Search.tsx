"use client";

import { Box, Button, Grid, useTheme, Typography } from '@mui/material';
import { Formik, Form, FormikProps } from 'formik';

import { SearchProps } from '../account.types';

import TextBox from '@/components/TextBox';
import { searchSalariesInitialValues, searchSalariesValidationSchema } from '@/modules/salaryAdvance/salaryAdvance.utils';
import { SearchSalariesFormValues } from '@/modules/salaryAdvance/salaryAdvance.types';


const Search = ({ onSearch }: SearchProps) => {
    const theme = useTheme();

    return (
        <Box sx={{ width: "100%", marginTop: 0}}>
            <Formik
                initialValues={searchSalariesInitialValues}
                validationSchema={searchSalariesValidationSchema}
                onSubmit={(values) => {
                    onSearch(values.month);
                }}
            >
                {(formik: FormikProps<SearchSalariesFormValues>) => (
                    <Form>
                        <Grid container spacing={1} marginTop={-2}>
                            <Grid item xs={6} marginTop={0}>
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

                            <Grid item xs={4}>
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
        </Box>
    );
};

export default Search;
