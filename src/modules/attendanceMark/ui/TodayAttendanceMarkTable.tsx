"use client";

import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import AddOutTimeModal from './AddOutTimeModal';
import AddInTimeModal from './AddInTimeModal';
import { TableProps } from '../attendanceMarks.types';

import { fetchAttendance } from '@/modules/test/service/test.service';
import { AttendanceRecordType } from '@/modules/test/test.types';
import { TableColumnType } from '@/type/common.types';


const getTodayDate = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const columns: TableColumnType[] = [
    { label: "Shift", width: "15%", align: "left" },
    { label: "Shift Duration", width: "20%", align: "left" },
    { label: "Full Name", width: "25%", align: "left" },
    { label: "In Time", width: "20%", align: "left" },
    { label: "Out Time", width: "20%", align: "left" },
];

const TodayAttendanceMarkTable: React.FC<TableProps> = ({ reload, handleReload }) => {
    const [attendanceMarks, setAttendanceMarks] = useState<AttendanceRecordType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const limit = 5;
    const [isInTimeModalOpen, setIsInTimeModalOpen] = useState(false);
    const [isOutTimeModalOpen, setIsOutTimeModalOpen] = useState(false);
    const todayDate = getTodayDate();
    const [selectedRow, setSelectedRow] = useState<AttendanceRecordType>({
        staffId: 0,
        name: '',
        startTime: '',
        endTime: '',
        attendanceId: 0,
        shiftId: '',
        shiftInfo: { id: 0, name: '', startTime: '', endTime: '' },
    });

    const handleInTimeModalOpen = (
        staffId: string | number,
        name: string,
        startTime: string,
        endTime: string,
        attendanceId: number,
        shiftInfo: any
    ) => {
        setIsInTimeModalOpen(true);
        setSelectedRow({
            staffId,
            name,
            startTime,
            endTime,
            attendanceId,
            shiftId: shiftInfo?.id || '',
            shiftInfo: shiftInfo || { id: 0, name: '', startTime: '', endTime: '' },
        });
    };

    const handleOutTimeModalOpen = (
        staffId: string | number,
        name: string,
        startTime: string,
        endTime: string,
        attendanceId: number,
        shiftInfo: any
    ) => {
        setIsOutTimeModalOpen(true);
        setSelectedRow({
            staffId,
            name,
            startTime,
            endTime,
            attendanceId,
            shiftId: shiftInfo?.id || '',
            shiftInfo: shiftInfo || { id: 0, name: '', startTime: '', endTime: '' },
        });
    };

    const handleClose = () => {
        setIsInTimeModalOpen(false);
        setIsOutTimeModalOpen(false);
        setSelectedRow({
            staffId: 0,
            name: '',
            startTime: '',
            endTime: '',
            attendanceId: 0,
            shiftId: '',
            shiftInfo: { id: 0, name: '', startTime: '', endTime: '' },
        });
    }

    const fetchAttendanceMarkData = async (noLoading?: boolean) => {
        setIsLoading(true)
        try {
            if (!noLoading) setIsLoading(true);

            const response = await fetchAttendance(todayDate);

            if (response?.success) {
                setAttendanceMarks(response.data);
                // setTotalRows(response.totalAttendance);
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

    function uniqueByStaffId(attendanceMarks: AttendanceRecordType[]): AttendanceRecordType[] {
        const map = new Map<number | string, AttendanceRecordType>();
        for (const item of attendanceMarks) {
            if (Number(item.shiftId) != 0) {
                if (!map.has(item.staffId)) {
                    map.set(item.staffId, item);
                }
            }
        }
        return Array.from(map.values());
    }

    const renderRows = () => {
        if (isLoading) {
            return Array.from({ length: 5 }).map((_, i) => (
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

        return uniqueByStaffId(attendanceMarks).map((mark, index) => (
            <TableRow
                key={mark.staffId}
                sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff", // alternating row colors
                }}
            >
                <TableCell align="left">{mark.shiftInfo.name}</TableCell>
                <TableCell align="left">
                    {mark.shiftInfo.startTime} - {mark.shiftInfo.endTime}
                </TableCell>
                <TableCell align="left">
                    {mark.staffId} - {mark.name}
                </TableCell>
                <TableCell align="left">
                    {mark.startTime ? (
                        mark.startTime
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                    setIsInTimeModalOpen(true);
                                    setSelectedRow(mark);
                                }}
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
                            {isInTimeModalOpen && (
                                <AddInTimeModal
                                    open={isInTimeModalOpen}
                                    handleClose={handleClose}
                                    handleReload={handleReload}
                                    selectedRow={selectedRow}
                                />
                            )}
                        </>
                    )}
                </TableCell>
                <TableCell align="left">
                    {mark.startTime && mark.endTime ? (
                        mark.endTime
                    ) : mark.startTime && !mark.endTime ? (
                        <>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                    setIsOutTimeModalOpen(true);
                                    setSelectedRow(mark);
                                }}
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
                            {isOutTimeModalOpen && (
                                <AddOutTimeModal
                                    open={isOutTimeModalOpen}
                                    handleClose={handleClose}
                                    handleReload={handleReload}
                                    selectedRow={selectedRow}
                                />
                            )}
                        </>
                    ) : (
                        "-"
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
                                    sx={{ fontWeight: "bold", width: col.width }}
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

export default TodayAttendanceMarkTable;
