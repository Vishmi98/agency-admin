"use client";

import React, { useEffect, useState } from 'react';
import { Box, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';

import { SalaryAdvanceDataType, SalaryAdvancesTableProps } from '../salaryAdvance.types';

import { getSalaryAdvancesByMonth } from '../service/salaryAdvance.service';


const columns = [
    { label: "Staff ID", key: "staffId", width: "15%", align: "left" as const },
    { label: "Full Name", key: "fullName", width: "35%", align: "left" as const },
    { label: "Date", key: "date", width: "25%", align: "left" as const },
    { label: "Amount (LKR)", key: "amount", width: "25%", align: "right" as const },
];

const SalaryAdvanceTable: React.FC<SalaryAdvancesTableProps> = ({ reload, selectedMonth }) => {
    const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvanceDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [totalRows, setTotalRows] = useState(0);

    const fetchSalaryAdvanceData = async (noLoading?: boolean, paramPage?: number) => {
        try {
            if (!noLoading) setIsLoading(true);

            const response = await getSalaryAdvancesByMonth(paramPage || (page) + 1, limit, selectedMonth);

            if (response?.success) {
                setSalaryAdvances(response.salaryAdvances);
                setTotalRows(response.totalSalaryAdvance);
            }
        } catch (error) {
            console.log('Error fetching salary advance data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSalaryAdvanceData();
    }, [reload]);

    useEffect(() => {
        fetchSalaryAdvanceData(true);
    }, [limit]);

    const onPageChange = async (page_: number) => {
        setPage(page_)
        fetchSalaryAdvanceData(true, page_ + 1);
    }

    const onRowsPerPageChange = async (rows: number) => {
        setLimit(rows);
        setPage(0);
    }

    const renderRows = () => {
        if (isLoading) {
            return Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    {columns.map((col) => (
                        <TableCell key={col.key} align={col.align}>
                            <Skeleton variant="text" width={120} />
                        </TableCell>
                    ))}
                </TableRow>
            ));
        }

        if (!salaryAdvances.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return salaryAdvances.map((data, index) => (
            <TableRow
                key={data.id}
                sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                }}
            >
                <TableCell align="left">{data.staffId}</TableCell>
                <TableCell align="left">
                    {data.staffInfo.firstName} {data.staffInfo.lastName}
                </TableCell>
                <TableCell align="left">{data.date}</TableCell>
                <TableCell align="right">
                    {data.amount.toLocaleString("en-US")}
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

            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={totalRows}
                rowsPerPage={limit}
                page={page}
                onPageChange={(e, newPage) => onPageChange(newPage)}
                onRowsPerPageChange={(e) =>
                    onRowsPerPageChange(parseInt(e.target.value, 10))
                }
            />
        </Box>
    );
};

export default SalaryAdvanceTable;
