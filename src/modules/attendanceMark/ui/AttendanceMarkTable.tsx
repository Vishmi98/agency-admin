"use client";

import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { getAttendanceMarkData } from '../services/attendanceMark.services';
import { AttendanceDataType, TableProps } from '../attendanceMarks.types';


const getTodayDate = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const AttendanceMarkTable: React.FC<TableProps> = ({ reload }) => {
    const [attendanceMarks, setAttendanceMarks] = useState<AttendanceDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [totalRows, setTotalRows] = useState(0);
    const todayDate = getTodayDate();

    const fetchAttendanceMarkData = async (noLoading?: boolean, paramPage?: number) => {
        setIsLoading(true)
        try {
            if (!noLoading) setIsLoading(true);

            const response = await getAttendanceMarkData(paramPage || (page) + 1, limit, todayDate);

            if (response?.success) {
                setAttendanceMarks(response.attendance);
                setTotalRows(response.totalAttendance);
            } else {
                setAttendanceMarks([])
            }
        } catch (error) {
            setAttendanceMarks([])
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
    }, [limit]);

    const onPageChange = async (page_: number) => {
        setPage(page_)
        fetchAttendanceMarkData(true, page_ + 1);
    }

    const onRowsPerPageChange = async (rows: number) => {
        setLimit(rows);
        setPage(0);
    }

    return (
        <Box>
            {isLoading ? (
                <Typography data-testid='loading' variant="body1" align="center">
                    Loading...
                </Typography>
            ) : attendanceMarks.length === 0 ? (
                <Typography data-testid='no-data' variant="body1" align="center">
                    No data available
                </Typography>
            ) : (
                <>
                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{
                            overflowX: 'auto',
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                        }}
                    >
                        <Table
                            sx={{
                                minWidth: 700,
                                borderCollapse: 'collapse',
                                '& th': {
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                    borderBottom: '1px solid #ddd',
                                },
                                '& tr': {
                                    borderBottom: '1px solid #ccc',
                                },
                                '& tbody > tr:last-child': {
                                    borderBottom: 'none',
                                },
                                '& td': {
                                    fontSize: '13px',
                                },
                            }}
                            aria-label="universities table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px" }}>Staff ID</TableCell>
                                    <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px" }}>Full Name</TableCell>
                                    <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px" }}>In Time</TableCell>
                                    <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px" }}>Out Time</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "12px" }}>Leave Type</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attendanceMarks.map((mark) => (
                                    <React.Fragment key={mark.id}>
                                        <TableRow>
                                            <TableCell align="left">{mark.staffId}</TableCell>
                                            <TableCell align="left">{mark.staffInfo.firstName} {mark.staffInfo.lastName}</TableCell>
                                            <TableCell align="left">{mark.inTime}</TableCell>
                                            <TableCell align="left">
                                                {mark.outTime ? (
                                                    mark.outTime
                                                ) : mark.leaveInfo ? (
                                                    ""
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            color="primary"
                                                            sx={{
                                                                backgroundColor: "#1976d2",
                                                                borderRadius: "5px",
                                                                textTransform: "none",
                                                                "&:hover": { backgroundColor: "#115293" },
                                                                width: "70px"
                                                            }}
                                                        >
                                                            <AddIcon sx={{ width: 20, height: 20 }} />
                                                            Add
                                                        </Button>
                                                    </>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">{mark.leaveInfo?.title.EN || "_"}</TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        component="div"
                        count={totalRows}
                        rowsPerPage={limit}
                        page={page}
                        onPageChange={(e, newPage) => { onPageChange(newPage) }}
                        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
                    />
                </>
            )}
        </Box>
    );
};

export default AttendanceMarkTable;
