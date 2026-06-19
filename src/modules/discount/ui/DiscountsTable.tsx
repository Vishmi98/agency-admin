"use client";

import React, { useEffect, useState } from 'react';
import { Box, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';


import { TableProps } from '@/modules/countries/countries.types';
import { ExtraPaymentDataType } from '@/modules/extraPayment/extraPayment.types';
import { getDiscountData } from '../services/discount.services';


const columns = [
    { label: "ID", key: "id", width: "10%", align: "center" as const },
    { label: "Title", key: "title", width: "40%", align: "left" as const },
    { label: "Amount", key: "amount", width: "25%", align: "right" as const },
    { label: "Currency", key: "currency", width: "25%", align: "right" as const },
];

const DiscountsTable: React.FC<TableProps> = ({ reload }) => {
    const [discounts, setDiscounts] = useState<ExtraPaymentDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchDiscounts = async () => {
        setIsLoading(true)
        try {
            const response = await getDiscountData();

            if (response?.success) {
                setDiscounts(response.discounts);
            } else {
                setDiscounts([])
            }
        } catch (error) {
            setDiscounts([])
            console.log('Error fetching discounts data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, [reload]);

    const renderRows = () => {
        if (isLoading) {
            return Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                    {columns.map((col) => (
                        <TableCell key={col.key} align={col.align}>
                            <Skeleton variant="text" width={120} />
                        </TableCell>
                    ))}
                </TableRow>
            ));
        }

        if (!discounts.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return discounts.map((discount, index) => (
            <TableRow
                key={discount.id}
                sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                }}
            >
                <TableCell align="center">{discount.id}</TableCell>
                <TableCell align="left">{discount.title.EN}</TableCell>
                <TableCell align="right">{discount.amount.toLocaleString("en-US")}</TableCell>
                <TableCell align="right">{discount.currency}</TableCell>
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

export default DiscountsTable;
