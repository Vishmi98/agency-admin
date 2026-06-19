"use client";

import React, { useEffect, useState } from 'react';
import { Formik, Form } from "formik";
import { Box, Typography, Button, Autocomplete, TextField } from '@mui/material';

import { FilterProps } from '../university.types';

import { StaffDataType } from '@/modules/staff/staff.types';
import { getStaffData } from '@/modules/staff/services/staff.services';
import { getCountriesData } from '@/modules/countries/services/countries.services';
import { DropdownType } from '@/type/common.types';


const Filter: React.FC<FilterProps> = ({ onSubmit }) => {
    const [countries, setCountries] = useState<DropdownType[]>([]);
    const [staffs, setStaffs] = useState<StaffDataType[]>([]);

    const fetchDropdownData = async () => {
        try {
            const [countriesRes, staffsRes] = await Promise.all([
                getCountriesData(),
                getStaffData(1, 100)
            ]);

            if (countriesRes.success) setCountries(countriesRes.countries);
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
                countryId: 0,
                staffId: 0
            }}
            onSubmit={onSubmit}
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
                        {/* Country Dropdown */}
                        <Box sx={{ width: { xs: "100%", md: "25%" } }}>
                            <Typography variant="body1" fontWeight="bold">Country</Typography>
                            <Autocomplete
                                size="small"
                                options={countries}
                                getOptionLabel={(option) => `${option.title.EN}` || ''}
                                value={countries.find((country) => country.id === values.countryId) || null}
                                onChange={(_, selectedOption) => {
                                    setFieldValue("countryId", selectedOption ? selectedOption.id : 0);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="All" variant="outlined" fullWidth />
                                )}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
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
                        type='submit'
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
