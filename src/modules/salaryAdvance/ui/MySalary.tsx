"use client"

import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, CircularProgress, Button, TextField } from '@mui/material';
import { getCookieUser } from '@/utils/cookie.util';

import { getSalaryAdvancesByStaffIdAndMonth } from '../service/salaryAdvance.service';

import { UserStoreUserType } from '@/type/common.types';


const MySalary = () => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [salary, setSalary] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const user = getCookieUser() as UserStoreUserType | "";

    const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMonth(event.target.value);
    };

    const fetchSalary = async () => {
        setError(null);
        setSalary(null);

        if (!selectedMonth) {
            setError("Please select a month.");
            return;
        }
        if (!user || !user.id) {
            setError("User not found or not logged in.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await getSalaryAdvancesByStaffIdAndMonth(user.id, selectedMonth);

            if (response.success && response.salaryAdvances.length > 0) {
                // Assuming salaryAdvances is an array of objects with a `amount` property
                // You might want to calculate total or pick the first item's amount
                // For example, sum all advances:
                const totalSalary = response.salaryAdvances.reduce(
                    (acc, curr) => acc + (curr.amount || 0),
                    0
                );
                setSalary(totalSalary);
            } else {
                setError(response.message || "No salary advances found.");
            }
        } catch (err) {
            setError("Failed to fetch salary. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box width="50%" mb={2}>
                <FormControl fullWidth>
                    <InputLabel shrink htmlFor="month-input">
                        Month
                    </InputLabel>
                    <TextField
                        id="month-input"
                        label="Select Month"
                        type="month"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                    />
                </FormControl>
            </Box>

            <Button
                variant="contained"
                color="primary"
                onClick={fetchSalary}
                disabled={isLoading || !selectedMonth}
                size="medium"
            >
                {isLoading ? <CircularProgress size={24} /> : "View Salary"}
            </Button>

            {error && (
                <Typography color="error" sx={{ marginTop: 2 }}>
                    {error}
                </Typography>
            )}

            {salary !== null && !isLoading && (
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="h6">Salary for {selectedMonth}:</Typography>
                    <Typography variant="h4" color="primary">
                        {salary} USD
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default MySalary;
