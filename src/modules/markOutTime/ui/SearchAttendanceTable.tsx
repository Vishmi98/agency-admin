"use client";

import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import AddOutTimeModal from './AddOutTimeModal';

import { AttendanceDataType, AttendanceMarkType, TableProps } from '@/modules/attendanceMark/attendanceMarks.types';
import { getAttendanceMissingOutTimeData } from '@/modules/attendanceMark/services/attendanceMark.services';
import { TableColumnType } from '@/type/common.types';


const columns: TableColumnType[] = [
    { label: "Staff ID", width: "15%", align: "left" },
    { label: "Name", width: "25%", align: "left" },
    { label: "Date", width: "20%", align: "left" },
    { label: "In Time", width: "20%", align: "left" },
    { label: "Out Time", width: "20%", align: "left" },
];

const SearchAttendanceTable: React.FC<TableProps> = ({ reload, handleReload }) => {
    const [attendanceMarks, setAttendanceMarks] = useState<AttendanceDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(0);
    const [isOutTimeModalOpen, setIsOutTimeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<AttendanceMarkType | null>(null);

    const handleClickOpen = (row: AttendanceMarkType) => {
        setSelectedRow(row);
        setIsOutTimeModalOpen(true);
    };

    const handleClose = () => {
        setIsOutTimeModalOpen(false);
        setSelectedRow(null);
    };

    const fetchAttendanceMarkData = async (noLoading?: boolean, paramPage?: number) => {
        try {
            if (!noLoading) setIsLoading(true);

            const response = await getAttendanceMissingOutTimeData(paramPage || (page) + 1, rowsPerPage);

            if (response?.success) {
                setAttendanceMarks(response.attendance);
                setTotalRows(response.totalAttendance);
            }
        } catch (error) {
            console.log('Error fetching attendance data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceMarkData();
    }, [reload]);

    useEffect(() => {
        fetchAttendanceMarkData(true);
    }, [rowsPerPage]);

    const onPageChange = async (page_: number) => {
        setPage(page_)
        fetchAttendanceMarkData(true, page_ + 1);
    }

    const onRowsPerPageChange = async (rows: number) => {
        setRowsPerPage(rows);
        setPage(0);
    }

    const renderRows = () => {
        if (isLoading) {
            return Array.from({ length: rowsPerPage }).map((_, i) => (
                <TableRow key={i}>
                    {columns.map((col) => (
                        <TableCell key={col.label} sx={{ width: col.width }}>
                            <Skeleton variant="text" />
                        </TableCell>
                    ))}
                </TableRow>
            ));
        }

        if (!attendanceMarks.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return attendanceMarks.map((mark, index) => (
            <TableRow
                key={mark.id}
                sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}
            >
                <TableCell align="left">{mark.staffId}</TableCell>
                <TableCell align="left">{mark.staffInfo?.firstName} {mark.staffInfo?.lastName}</TableCell>
                <TableCell align="left">{mark.date}</TableCell>
                <TableCell align="left">{mark.inTime || "-"}</TableCell>
                <TableCell align="left">
                    {mark.outTime || !mark.leaveInfo ? (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleClickOpen(mark)}
                            sx={{
                                backgroundColor: "#1976d2",
                                borderRadius: "5px",
                                textTransform: "none",
                                "&:hover": { backgroundColor: "#115293" },
                                width: "70px",
                                fontSize: "12px"
                            }}
                        >
                            <AddIcon sx={{ width: 18, height: 18 }} /> Add
                        </Button>
                    ) : (
                        mark.outTime
                    )}
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
                    maxHeight: 400,
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
                            backgroundColor: "#fff",
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
                                    sx={{ fontWeight: "bold", width: col.width, backgroundColor: "#fff" }}
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
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => onPageChange(newPage)}
                onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
            />

            {selectedRow && (
                <AddOutTimeModal
                    open={isOutTimeModalOpen}
                    handleClose={handleClose}
                    handleReload={handleReload}
                    selectedRow={selectedRow}
                />
            )}
        </Box>
    );
};

export default SearchAttendanceTable;
