"use client";

import React, { useEffect, useState } from 'react';
import { Box, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import { getCountriesData } from '../services/countries.services';
import { TableProps } from '../countries.types';

import { DropdownType } from '@/type/common.types';


const columns = [
    { label: "ID", key: "id", width: "10%", align: "center" as const },
    { label: "Country", key: "title", width: "90%", align: "left" as const },
];

const CountriesTable: React.FC<TableProps> = ({ reload }) => {
    const [countries, setCountries] = useState<DropdownType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchCountryData = async () => {
        setIsLoading(true);
        try {
            const response = await getCountriesData();
            if (response.success) {
                setCountries(response.countries);
            } else {
                setCountries([]);
            }
        } catch (error) {
            setCountries([])
            // console.log('Error fetching countries data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCountryData();
    }, [reload]);

    const renderRows = () => {
        if (isLoading) {
            return Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                    {columns.map((col) => (
                        <TableCell key={col.key} align={col.align}>
                            <Skeleton variant="text" width={200} />
                        </TableCell>
                    ))}
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

        return countries
            .map((country, index) => (
                <TableRow
                    key={country.id}
                    sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
                >
                    <TableCell align="center">{country.id}</TableCell>
                    <TableCell align="left" sx={{ textTransform: "capitalize" }}>
                        {country.title.EN}
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
                                <TableCell
                                    key={col.key}
                                    align={col.align}
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                        backgroundColor: "#fff",
                                        top: 0,
                                        zIndex: 2,
                                        borderBottom: "1px solid #ddd",
                                        width: col.width,
                                    }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderRows()}</TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CountriesTable;