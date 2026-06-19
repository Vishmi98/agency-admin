"use client";

import { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, TextField, Autocomplete } from '@mui/material';
import { Formik, Form, Field } from 'formik';

import { SearchShiftProps } from '../attendance.types';
import { searchShiftInitialValues, searchShiftValidationSchema } from '../attendance.utils';
import { getRosterById } from '../services/attendance.service';

import { StaffDataType } from '@/modules/staff/staff.types';
import { getIsAttendanceMatterStaffs } from '@/modules/staff/services/staff.services';


const SearchShift = ({ onSearch }: SearchShiftProps) => {
    const [staffs, setStaffs] = useState<StaffDataType[]>([]);
    const [year] = useState<number>(new Date().getFullYear());
    const [month] = useState<number>(new Date().getMonth() + 1);

    const rosterId = `${year}${String(month).padStart(2, '0')}`;

    const fetchDropdownData = async () => {
        try {
            const staffsRes = await getIsAttendanceMatterStaffs(1, 100);
            if (staffsRes.success) setStaffs(staffsRes.staffs);
        } catch (error) {
            console.log("Error fetching dropdown data:", error);
        }
    };

    useEffect(() => {
        fetchDropdownData();
    }, []);

    return (
        <Formik
            initialValues={searchShiftInitialValues}
            validationSchema={searchShiftValidationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                    const response = await getRosterById(rosterId, values.date, values.staffId);
                    if (response.success) {
                        onSearch(response);
                        resetForm();
                    } else {
                        onSearch({ poyaDay: true, date: values.date, staffId: values.staffId });  // Special object for Poya Day
                    }
                } catch (error) {
                    console.log('Error fetching roster:', error);
                    // Optional: toast.error('Failed to fetch roster');
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ values, setFieldValue }) => (
                <Form>
                    <Grid container spacing={1} marginTop={-2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography fontSize="12px">Date</Typography>
                            <Field
                                as={TextField}
                                name="date"
                                type="date"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Typography fontSize="12px">Staff ID</Typography>
                            <Autocomplete
                                size="small"
                                options={staffs}
                                getOptionLabel={(option) => `${option.firstName} ${option.lastName}` || ''}
                                value={staffs.find((staff) => staff.id === values.staffId) || null}
                                onChange={(_, selectedOption) => {
                                    setFieldValue("staffId", selectedOption ? selectedOption.id : 0);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="All" variant="outlined" fullWidth />
                                )}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                        </Grid>

                        <Grid item xs={4} md={2} display="flex" alignItems="flex-end">
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
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default SearchShift;
