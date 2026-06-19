"use client"

import React, { useEffect, useState } from 'react';
import {
    Autocomplete,
    Box,
    Grid,
    TextField,
    Typography,
    Chip,
    Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { StaffDataType } from '@/modules/staff/staff.types';
import { getStaffData } from '@/modules/staff/services/staff.services';


const GenerateSalaries = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [staffs, setStaffs] = useState<StaffDataType[]>([]);
    const [selectedStaffs, setSelectedStaffs] = useState<StaffDataType[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchStaffMembers = async () => {
        setIsLoading(true);
        try {
            const response = await getStaffData(1, 100);
            if (response.success) {
                setStaffs(response.staffs);
            } else {
                console.log("Error fetching staff data");
            }
        } catch (error) {
            console.log("Error", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffMembers();
    }, []);

    const handleRemove = (staffId: number) => {
        setSelectedStaffs((prev) => prev.filter((s) => s.id !== staffId));
    };

    const handleGenerateSalaries = async () => {
        const selectedIds = selectedStaffs.map((s) => s.id);
        setIsSubmitting(true);
        console.log("staffIds", selectedIds);
        setIsSubmitting(true);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography fontSize="12px">Select Staff Members</Typography>
                    <Autocomplete
                        multiple
                        options={staffs}
                        getOptionLabel={(option) => `${option.id}`}
                        loading={isLoading}
                        value={selectedStaffs}
                        onChange={(event, value) => setSelectedStaffs(value)}
                        size="small"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Search staff..."
                                fullWidth
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    {selectedStaffs.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                            {selectedStaffs.map((staff) => (
                                <Chip
                                    key={staff.id}
                                    label={`${staff.id} - ${staff.fullName}`}
                                    onDelete={() => handleRemove(staff.id)}
                                    deleteIcon={<CloseIcon />}
                                />
                            ))}
                        </Box>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGenerateSalaries}
                        disabled={selectedStaffs.length === 0 || isSubmitting}
                    >
                        {isSubmitting ? "Generating..." : "Generate Salaries"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default GenerateSalaries;
