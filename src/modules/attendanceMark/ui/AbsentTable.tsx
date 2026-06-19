"use client";

import React, { useEffect, useState } from 'react';
import { Box, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';

import { getLeaves } from '../services/attendanceMark.services';
import { AttendanceDataType_, AttendanceTableProps } from '../attendanceMarks.types';
import { TableColumnType } from '@/type/common.types';


const columns: TableColumnType[] = [
    { label: "Staff ID", width: "10%", align: "left" },
    { label: "Full Name", width: "25%", align: "left" },
    { label: "Date", width: "15%", align: "left" },
    { label: "In Time", width: "15%", align: "center" },
    { label: "Out Time", width: "15%", align: "center" },
    { label: "Leave Type", width: "20%", align: "center" },
];

const AbsentTable: React.FC<AttendanceTableProps> = ({ todayDate }) => {
    const [leaves, setLeaves] = useState<AttendanceDataType_[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [totalRows, setTotalRows] = useState(0);

    const fetchLeaves = async (noLoading?: boolean, paramPage?: number) => {
        try {
            if (!noLoading) setIsLoading(true);

            const response = await getLeaves(paramPage || (page + 1), limit, todayDate);

            if (response?.success) {
                setLeaves(response.leaves);
                setTotalRows(response.totalLeaves);
            } else {
                setLeaves([]);
            }
        } catch (error) {
            setLeaves([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [todayDate]);

    useEffect(() => {
        fetchLeaves(true);
    }, [limit]);

    const onPageChange = async (page_: number) => {
        setPage(page_)
        fetchLeaves(true, page_ + 1);
    }

    const onRowsPerPageChange = async (rows: number) => {
        setLimit(rows);
        setPage(0);
    }

    const renderRows = () => {
        if (isLoading) {
            return Array.from({ length: limit }).map((_, i) => (
                <TableRow key={i}>
                    {columns.map((col) => (
                        <TableCell key={col.label} sx={{ width: col.width }}>
                            <Skeleton variant="text" />
                        </TableCell>
                    ))}
                </TableRow>
            ));
        }

        if (!leaves.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return leaves.map((mark, index) => (
            <TableRow
                key={mark.id}
                sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff", // even vs odd row color
                }}
            >
                <TableCell align="left">{mark.staffId}</TableCell>
                <TableCell align="left">
                    {mark.staffInfo?.firstName} {mark.staffInfo?.lastName}
                </TableCell>
                <TableCell align="left">{mark.date}</TableCell>
                <TableCell align="center">{mark?.inTime || "_"}</TableCell>
                <TableCell align="center">{mark?.outTime || "_"}</TableCell>
                <TableCell align="center">{mark.leaveInfo?.title?.EN || "_"}</TableCell>
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
                                    key={col.label}
                                    align={col.align || "left"}
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
                onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
            />
        </Box>
    );
};

export default AbsentTable;

