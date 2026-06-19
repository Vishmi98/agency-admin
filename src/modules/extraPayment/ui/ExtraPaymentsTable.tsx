"use client";

import React, { useEffect, useState } from 'react';
import { Box, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import { getExtraPaymentData } from '../services/extraPayment.services';
import { ExtraPaymentDataType } from '../extraPayment.types';

import { TableProps } from '@/modules/countries/countries.types';


const columns = [
    { label: "ID", key: "id", width: "10%", align: "center" as const },
    { label: "Title", key: "title", width: "50%", align: "left" as const },
    { label: "Amount", key: "amount", width: "20%", align: "right" as const },
    { label: "Currency", key: "currency", width: "20%", align: "right" as const },
];

const ExtraPaymentsTable: React.FC<TableProps> = ({ reload }) => {
    const [extraPayments, setExtraPayments] = useState<ExtraPaymentDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchExtraPaymentData = async () => {
        setIsLoading(true)
        try {
            const response = await getExtraPaymentData();

            if (response?.success) {
                setExtraPayments(response.extraPayments);
            } else {
                setExtraPayments([])
            }
        } catch (error) {
            setExtraPayments([])
            console.log('Error fetching extra payments data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExtraPaymentData();
    }, [reload]);

    const renderRows = () => {
        if (isLoading) {
            return Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                    {columns.map((col) => (
                        <TableCell key={col.key} align={col.align}>
                            <Skeleton variant="text" width={100} />
                        </TableCell>
                    ))}
                </TableRow>
            ));
        }

        if (!extraPayments.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return extraPayments.map((payment, index) => (
            <TableRow
                key={payment.id}
                sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
            >
                <TableCell align="center">{payment.id}</TableCell>
                <TableCell align="left">{payment.title.EN}</TableCell>
                <TableCell align="right">{payment.amount.toLocaleString("en-US")}</TableCell>
                <TableCell align="right">{payment.currency}</TableCell>
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

export default ExtraPaymentsTable;
