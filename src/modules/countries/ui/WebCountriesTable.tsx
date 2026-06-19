"use client";

import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import { toast } from 'react-toastify';

import { TableProps, WebCountryDataType } from '../countries.types';
import { getWebCountriesData, publishWebCountry } from '../services/countries.services';


const columns = [
    { label: "ID", key: "id", width: "10%", align: "center" as const },
    { label: "Country", key: "country", width: "15%", align: "left" as const },
    { label: "Title", key: "title", width: "25%", align: "left" as const },
    { label: "Short Description", key: "shortDescription", width: "40%", align: "left" as const },
];

const WebCountriesTable: React.FC<TableProps> = ({ reload }) => {
    const theme = useTheme();

    const [countries, setCountries] = useState<WebCountryDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<WebCountryDataType | null>(null);

    const fetchCountryData = async () => {
        setIsLoading(true);
        try {
            const response = await getWebCountriesData();
            if (response.success) {
                setCountries(response.countries);
            } else {
                setCountries([]);
            }
        } catch (error) {
            setCountries([])
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenDialog = (country: WebCountryDataType) => {
        setSelectedCountry(country);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCountry(null);
    };

    const handleConfirmPublish = async () => {
        if (!selectedCountry) return;
        try {
            const newPublishStatus = !selectedCountry.isPublish;
            const response = await publishWebCountry(selectedCountry.id, newPublishStatus);

            if (response.success) {
                toast.success(response.message || `Country ${newPublishStatus ? 'published' : 'unpublished'} successfully`);
                fetchCountryData(); // Refresh
            } else {
                toast.error(response.message || "Failed to update publish status");
            }
        } catch (error) {
            toast.error("An error occurred while updating publish status");
        } finally {
            handleCloseDialog();
        }
    };

    useEffect(() => {
        fetchCountryData();
    }, [reload]);

    const renderRows = () => {
        if (isLoading) {
            return Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    {columns.map((col) => (
                        <TableCell key={col.key} align={col.align}>
                            <Skeleton variant="text" width="100%" />
                        </TableCell>
                    ))}
                    <TableCell align="center" sx={{ display: "flex", gap: 1 }}>
                        <Skeleton variant="text" width="100%" />
                    </TableCell>
                </TableRow>
            ));
        }

        if (!countries.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return countries.map((country, index) => (
            <TableRow key={country.id} sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
                <TableCell align="center">{country.id}</TableCell>
                <TableCell align="left" sx={{ textTransform: "capitalize" }}>{country.country}</TableCell>
                <TableCell align="left">{country.title}</TableCell>
                <TableCell align="left">{country.shortDescription}</TableCell>
                <TableCell align="center">
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleOpenDialog(country)}
                        sx={{
                            backgroundColor: country.isPublish ? '#d32f2f' : '#1976d2',
                            '&:hover': {
                                backgroundColor: country.isPublish ? '#b71c1c' : '#115293',
                            },
                            fontSize: "10px"
                        }}
                    >
                        {country.isPublish ? "Unpublish" : "Publish"}
                    </Button>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <Box>
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    maxHeight: 370,
                    overflowY: "auto",
                    borderRadius: "5px",
                }}
            >
                <Table
                    stickyHeader
                    sx={{
                        minWidth: 700,
                        borderCollapse: "collapse",
                        "& th": {
                            fontWeight: "bold",
                            fontSize: "12px",
                            borderBottom: "1px solid #ddd",
                            py: 1,
                        },
                        "& td": {
                            fontSize: "12px",
                            py: 1,
                        },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.key} align={col.align} sx={{ fontWeight: "bold", fontSize: 12, backgroundColor: "#fff", borderBottom: "1px solid #ddd", width: col.width }}>
                                    {col.label}
                                </TableCell>
                            ))}
                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: 12,
                                    backgroundColor: "#fff",
                                    borderBottom: "1px solid #ddd",
                                }}
                            >
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderRows()}</TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="xs"
                PaperProps={{ style: { borderRadius: 10, boxShadow: "0px 4px 20px rgba(0,0,0,0.1)", backgroundColor: theme.palette.background.paper } }}
            >
                <DialogTitle sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                    Confirm {selectedCountry?.isPublish ? 'Unpublish' : 'Publish'} Country
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to {selectedCountry?.isPublish ? 'Unpublish' : 'Publish'} this country?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ gap: 1 }}>
                    <Button onClick={handleCloseDialog} variant="outlined" sx={{ width: 120 }}>No</Button>
                    <Button onClick={handleConfirmPublish} variant="contained" sx={{ width: 120 }}>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WebCountriesTable;
