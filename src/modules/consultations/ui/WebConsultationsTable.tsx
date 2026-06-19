"use client";

import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

import { WebConsultationDataType } from '../consultations.types';
import { getWebConsultationsData, updateConsultationStatus } from '../services/consultations.service';

import { TableProps } from '@/modules/countries/countries.types';


const columns = [
    { label: "Name", key: "name", width: "15%", align: "left" as const },
    { label: "Email", key: "email", width: "15%", align: "left" as const },
    { label: "Phone Number", key: "phone", width: "10%", align: "left" as const },
    { label: "Message", key: "message", width: "20%", align: "left" as const },
    { label: "Country", key: "country", width: "10%", align: "center" as const },
    { label: "Course", key: "course", width: "20%", align: "left" as const },
    { label: "Status", key: "status", width: "10%", align: "center" as const },
];

const WebConsultationsTable: React.FC<TableProps> = ({ reload }) => {
    const [consultations, setConsultations] = useState<WebConsultationDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [totalRows, setTotalRows] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingConsultationId, setLoadingConsultationId] = useState<number | null>(null);
    const [selectedConsultationId, setSelectedConsultationId] = useState<number | null>(null);

    const handleUpdateStatus = async (consultationId: number) => {
        setLoadingConsultationId(consultationId);

        try {
            const response = await updateConsultationStatus(consultationId, 2);

            if (response.success) {
                toast.success(response.success);
                await fetchData();
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error("An error occurred while updating status.")
        } finally {
            setLoadingConsultationId(null);
            setIsModalOpen(false);
        }
    };

    const handleOpenModal = (consultationId: number) => {
        setSelectedConsultationId(consultationId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedConsultationId(null);
    };

    const fetchData = async (pramPage?: number) => {
        setIsLoading(true);
        try {
            const response = await getWebConsultationsData(pramPage || (page) + 1, limit);
            if (response.success) {
                setConsultations(response.leads);
                setTotalRows(response.totalLeads)
            } else {
                setConsultations([]);
            }
        } catch (error) {
            setConsultations([])
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [reload]);

    const onPageChange = async (page_: number) => {
        setPage(page_)
        fetchData(page_ + 1);
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
                            <Skeleton variant="text" width="100%" />
                        </TableCell>
                    ))}
                </TableRow>
            ));
        }

        if (!consultations.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return consultations.map((data, index) => (
            <TableRow key={data.id} sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
                <TableCell align="left">{data.firstName} {data.lastName}</TableCell>
                <TableCell align="left">{data.email}</TableCell>
                <TableCell align="left">{data.phone}</TableCell>
                <TableCell align="left">{data.message}</TableCell>
                <TableCell align="center">{data.countryInfo.country}</TableCell>
                <TableCell align="left">{data.courseInfo.courseName} - {data.uniInfo.name}</TableCell>
                <TableCell align="center">
                    <Box
                        sx={{
                            backgroundColor: data.statusInfo?.color,
                            color: "#fff",
                            fontSize: "10px",
                            fontWeight: "bold",
                            borderRadius: "20px",
                            padding: "3px 8px",
                            display: "flex",
                            justifyContent: "center",
                            cursor: data.statusInfo?.title.EN === 'Pending' && !loadingConsultationId ? "pointer" : "not-allowed",
                            opacity: loadingConsultationId === data.id ? 0.6 : 1,
                        }}
                        onClick={() => data.statusInfo?.title.EN === 'Pending' && !loadingConsultationId && handleOpenModal(data.id)}
                    >
                        {loadingConsultationId === data.id ? <CircularProgress size={14} color="inherit" /> : data.statusInfo?.title.EN}
                    </Box>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <Box>
            <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 370, overflowY: "auto", borderRadius: "5px" }}>
                <Table stickyHeader sx={{ minWidth: 700, borderCollapse: "collapse", "& th": { fontWeight: "bold", fontSize: "12px", borderBottom: "1px solid #ddd", py: 1 }, "& td": { fontSize: "12px", py: 1 } }}>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.key} align={col.align} sx={{ backgroundColor: "#fff", borderBottom: "1px solid #ddd", width: col.width }}>
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
                onPageChange={(e, newPage) => { onPageChange(newPage) }}
                onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
            />

            <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="xs" PaperProps={{ style: { borderRadius: 10 } }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <DialogTitle
                        sx={{
                            padding: "16px 24px",
                            fontWeight: "bold",
                            position: "sticky",
                            top: 0,
                            zIndex: 1000,
                        }}
                    >
                        Confirm Update
                    </DialogTitle>
                    <CloseIcon data-testid="CloseIcon" sx={{ width: 15, height: 15, marginRight: 3 }} onClick={handleCloseModal} />
                </Box>
                <DialogContent>
                    <Typography>Are you sure you want to update?</Typography>
                </DialogContent>
                <DialogActions sx={{ gap: 1 }}>
                    <Button onClick={handleCloseModal} variant="outlined" sx={{ width: 120 }}>No</Button>
                    <Button onClick={() => selectedConsultationId && handleUpdateStatus(selectedConsultationId)} variant="contained" sx={{ width: 120 }}>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WebConsultationsTable;
