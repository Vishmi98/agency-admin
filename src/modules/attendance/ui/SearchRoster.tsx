"use client";

import { Box, Button, Grid, useTheme, Typography, FormControl, Select, MenuItem } from '@mui/material';
import { Formik, Form, FormikProps, Field } from 'formik';
import * as Yup from 'yup';

import { SearchMonthFormValues, SearchRosterProps } from '../attendance.types';


const SearchRoster = ({ months, onSearch }: SearchRosterProps) => {
    const theme = useTheme();

    const searchMonthInitialValues = {
        month: "",
    };

    const searchMonthValidationSchema = Yup.object().shape({
        month: Yup.string().required('Month is required'),
    });

    return (
        <Formik
            initialValues={searchMonthInitialValues}
            validationSchema={searchMonthValidationSchema}
            onSubmit={(values) => {
                onSearch(values.month);
            }}
        >
            {(formik: FormikProps<SearchMonthFormValues>) => (
                <Form>
                    <Grid container spacing={1} marginTop={-2}>
                        <Grid item xs={6} md={4}>
                            <Typography fontSize="12px">Month</Typography>
                            <FormControl fullWidth size="small">
                                <Field
                                    name="month"
                                    as={Select}
                                    value={formik.values.month}
                                    onChange={formik.handleChange}
                                >
                                    {months.map((monthItem) => (
                                        <MenuItem key={monthItem._id} value={monthItem.month}>
                                            {new Date(monthItem.month).toLocaleString('en-US', {
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </FormControl>
                        </Grid>

                        <Grid item xs={4} md={2}>
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
                                    disabled={!formik.values.month}
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
    );
};

export default SearchRoster;
