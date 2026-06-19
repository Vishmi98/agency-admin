"use client";

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from "formik";
import { FormControl, Box, Typography, TextField, Button, Autocomplete } from '@mui/material';

import { StaffDataType } from '@/modules/staff/staff.types';
import { getStaffData } from '@/modules/staff/services/staff.services';


const Filter = () => {
    const [staffs, setStaffs] = useState<StaffDataType[]>([]);

    const fetchDropdownData = async () => {
        try {
            const [staffsRes] = await Promise.all([
                getStaffData(1, 100)
            ]);

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
            initialValues={{
                startDate: null,
                endDate: null,
                staffId: null
            }}
            onSubmit={(values) => {
                console.log('Filter values:', values);
            }}
        >
            {({ values, setFieldValue }) => (
                <Form className="flex flex-col w-full gap-4 p-5 bg-white" style={{ borderRadius: 13 }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            flexWrap: "wrap",
                            justifyContent: "flex-start",
                            width: "100%",
                            gap: { xs: 2 }
                        }}
                    >
                        {/* Start Date */}
                        <Box sx={{ width: { xs: "100%", md: "25%" } }}>
                            <Typography variant="body1" fontWeight="bold">Start date</Typography>
                            <FormControl fullWidth>
                                <Field
                                    as={TextField}
                                    name="startDate"
                                    type="date"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </FormControl>
                        </Box>

                        {/* End Date */}
                        <Box sx={{ width: { xs: "100%", md: "25%" } }}>
                            <Typography variant="body1" fontWeight="bold">End date</Typography>
                            <FormControl fullWidth>
                                <Field
                                    as={TextField}
                                    name="endDate"
                                    type="date"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </FormControl>
                        </Box>

                        {/* Staff Dropdown */}
                        <Box sx={{ width: { xs: "100%", md: "25%" } }}>
                            <Typography variant="body1" fontWeight="bold">Staff</Typography>
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
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mb: 2, width: "20%" }}
                    >
                        Search
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default Filter;
