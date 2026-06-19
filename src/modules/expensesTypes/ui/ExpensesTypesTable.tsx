"use client";

import React, { useEffect, useState } from 'react';
import { Box, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import { getExpensesTypesData } from '../services/expenseTypes.services';

import { DropdownType } from '@/type/common.types';
import { TableProps } from '@/modules/countries/countries.types';


const columns = [
    { label: "ID", key: "id", width: "10%", align: "center" as const },
    { label: "Expenses Type", key: "title", width: "90%", align: "left" as const },
];

const ExpensesTypesTable: React.FC<TableProps> = ({ reload }) => {
    const [expensesTypes, setExpensesTypes] = useState<DropdownType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchExpensesTypesData = async () => {//CHECK
        setIsLoading(true);
        try {
            const response = await getExpensesTypesData();
            if (response.success) {
                setExpensesTypes(response.expenseTypes);
            } else {
                setExpensesTypes([]);
            }
        } catch (error) {
            setExpensesTypes([])
            // console.log('Error fetching expenseTypes data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExpensesTypesData();
    }, [reload]);

    const renderRows = () => {
        if (isLoading) {
            return Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    {columns.map((col) => (
                        <TableCell key={col.key} align={col.align}>
                            <Skeleton variant="text" width={200} />
                        </TableCell>
                    ))}
                </TableRow>
            ));
        }

        if (!expensesTypes.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return expensesTypes.map((expense, index) => (
            <TableRow
                key={expense.id}
                sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
            >
                <TableCell align="center">{expense.id}</TableCell>
                <TableCell align="left" sx={{ textTransform: "capitalize" }}>
                    {expense.title.EN}
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

export default ExpensesTypesTable;