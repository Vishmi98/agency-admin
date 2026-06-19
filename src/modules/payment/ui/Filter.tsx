"use client";

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from "formik";
import { FormControl, Box, Typography, TextField, Button, Autocomplete } from '@mui/material';
import { subDays } from 'date-fns';

import { UniversityDataType } from '@/modules/university/university.types';
import { StaffDataType } from '@/modules/staff/staff.types';
import { getUniversityData } from '@/modules/university/services/university.services';
import { getStaffData } from '@/modules/staff/services/staff.services';
import { FilterProps } from '@/modules/invoice/invoice.types';


const Filter: React.FC<FilterProps> = ({ onSubmit }) => {
    const [universities, setUniversities] = useState<UniversityDataType[]>([]);
    const [staffs, setStaffs] = useState<StaffDataType[]>([]);

    const today = new Date().toISOString().split('T')[0];
    const yesterday = subDays(new Date(), 1).toISOString().split('T')[0];

    const fetchDropdownData = async () => {
        try {
            const [universitiesRes, staffsRes] = await Promise.all([
                getUniversityData(1, 100),
                getStaffData(1, 100)
            ]);

            if (universitiesRes.success) setUniversities(universitiesRes.universities);
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
                startDate: yesterday,
                endDate: today,
                universityId: 0,
                staffId: 0
            }}
            onSubmit={onSubmit}
        >
            {({ values, setFieldValue }) => (
                <Form
                    className="flex flex-col w-full gap-4"
                    style={{
                        backgroundColor: "#fff",
                        padding: "10px",
                        borderRadius: "5px",
                        width: "100%"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            justifyContent: "space-between",
                            gap: 2
                        }}
                    >
                        {/* Start Date */}
                        <Box sx={{ width: { xs: "100%" } }}>
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
                        <Box sx={{ width: { xs: "100%" } }}>
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


                        {/* University Dropdown */}
                        <Box sx={{ width: { xs: "100%" } }}>
                            <Typography variant="body1" fontWeight="bold">University</Typography>
                            <Autocomplete
                                size="small"
                                options={universities}
                                getOptionLabel={(option) => option.name || ''}
                                value={universities.find((uni) => uni.id === values.universityId) || null}
                                onChange={(_, selectedOption) => {
                                    setFieldValue("universityId", selectedOption ? selectedOption.id : 0);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="All" variant="outlined" fullWidth />
                                )}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                        </Box>

                        {/* Staff Dropdown */}
                        <Box sx={{ width: { xs: "100%" } }}>
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
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ width: "20%" }}
                    >
                        Search
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default Filter;
