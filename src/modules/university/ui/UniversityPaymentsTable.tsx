"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Box, Dialog, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { UniversityPaymentsTableProps } from '../university.types';


const UniversityPaymentsTable: React.FC<UniversityPaymentsTableProps> = ({
    totalRows,
    universityPayments,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
}) => {
    const [openDocModal, setOpenDocModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

    const handleOpenDocument = (docPath: string) => {
        setSelectedDocument(docPath);
        setOpenDocModal(true);
    };

    const handleCloseDocument = () => {
        setOpenDocModal(false);
        setSelectedDocument(null);
    };

    const columns = [
        { label: "Date", key: "date", width: "20%", align: "left" as const },
        { label: "Invoice ID", key: "invoiceId", width: "20%", align: "left" as const },
        { label: "Payment Type", key: "paymentTypeInfo", width: "30%", align: "left" as const },
        { label: "Document", key: "documentPath", width: "30%", align: "center" as const },
    ];

    const renderRows = () => {
        if (isLoading) {
            return Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    {columns.map((col) => (
                        <TableCell key={col.key} align={col.align}>
                            <Skeleton variant="text" />
                        </TableCell>
                    ))}
                </TableRow>
            ));
        }

        if (!universityPayments.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return universityPayments.map((payment, index) => (
            <TableRow
                key={payment.id}
                sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}
            >
                <TableCell align="left">{payment.date}</TableCell>
                <TableCell align="left">INV-{payment.invoiceId}</TableCell>
                <TableCell align="left">{payment.paymentTypeInfo?.title.EN}</TableCell>
                <TableCell align="center">
                    {payment.documentPath ? (
                        <Box
                            sx={{ cursor: "pointer", display: "inline-block" }}
                            onClick={() => handleOpenDocument(payment.documentPath!)}
                        >
                            {payment.documentPath.endsWith(".pdf") ? (
                                <Typography color="primary" sx={{ textDecoration: "underline" }}>
                                    View PDF
                                </Typography>
                            ) : (
                                <Image
                                    src={payment.documentPath}
                                    alt="University Payment Document"
                                    width={60}
                                    height={60}
                                    style={{ objectFit: "cover", borderRadius: "5px" }}
                                />
                            )}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No Document
                        </Typography>
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
                                        fontSize: 12,
                                        backgroundColor: "#fff",
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
                page={page - 1}
                onPageChange={(e, newPage) => onPageChange(newPage)}
                onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
            />

            {/* Document Preview Modal */}
            <Dialog open={openDocModal} onClose={handleCloseDocument} maxWidth="md">
                <Box display="flex" justifyContent="flex-end" p={1}>
                    <IconButton onClick={handleCloseDocument}>
                        <CloseIcon sx={{ width: 15, height: 15 }} />
                    </IconButton>
                </Box>
                <Box sx={{ p: 2, maxHeight: "600px", overflowY: "auto", width: "500px" }}>
                    {selectedDocument && selectedDocument.endsWith(".pdf") ? (
                        <Box sx={{ height: "80vh", width: "100%" }}>
                            <iframe
                                src={selectedDocument}
                                title="Document Preview"
                                width="100%"
                                height="100%"
                                style={{ border: "none" }}
                            />
                        </Box>
                    ) : (
                        selectedDocument && (
                            <Box display="flex" justifyContent="center">
                                <Image
                                    src={selectedDocument}
                                    alt="Document Preview"
                                    width={600}
                                    height={600}
                                    style={{
                                        objectFit: "contain",
                                        maxHeight: "80vh",
                                        borderRadius: "8px",
                                    }}
                                />
                            </Box>
                        )
                    )}
                </Box>
            </Dialog>
        </Box>
    );
};

export default UniversityPaymentsTable;