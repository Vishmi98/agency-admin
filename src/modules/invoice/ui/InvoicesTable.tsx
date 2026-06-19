"use client";

import React, { useState } from 'react';
import { Box, Dialog, DialogContent, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import Invoice from './Invoice';
import { InvoiceDataType, InvoiceTableProps } from '../invoice.types';


const InvoicesTable: React.FC<InvoiceTableProps> = ({
    totalRows,
    invoices,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
    selectedInvoice,
    setSelectedInvoice,
}) => {
    const [openPreviewModal, setOpenPreviewModal] = useState(false);

    const handlePreviewClick = (invoice: InvoiceDataType) => {
        setSelectedInvoice(invoice);
        setOpenPreviewModal(true);
    };

    const columns = [
        { label: "Invoice ID (INV)", key: "id", width: "10%", align: "center" as const },
        { label: "Date", key: "invoiceDate", width: "15%", align: "left" as const },
        { label: "Package Title", key: "packageTitle", width: "20%", align: "left" as const },
        { label: "Staff Member", key: "staff", width: "10%", align: "left" as const },
        { label: "Student Name", key: "studentName", width: "20%", align: "left" as const },
        { label: "Total Price (LKR)", key: "totalPrice", width: "10%", align: "right" as const },
        { label: "Due Amount (LKR)", key: "dueAmount", width: "10%", align: "right" as const },
        { label: "Status", key: "status", width: "5%", align: "center" as const },
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
                    <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
                        <Skeleton variant="circular" width={24} height={24} />
                    </TableCell>
                </TableRow>
            ));
        }

        if (!invoices.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return invoices.map((invoice, index) => (
            <React.Fragment key={invoice.id}>
                <TableRow
                    sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
                >
                    <TableCell align="center">{invoice.id}</TableCell>
                    <TableCell align="left">{invoice.invoiceDate}</TableCell>
                    <TableCell align="left">{invoice.updatePackageId ? invoice.updatePackage.title : invoice.packageInfo?.title}</TableCell>
                    <TableCell align="left">
                        {invoice.staffId} - {invoice.staffInfo?.firstName}
                    </TableCell>
                    <TableCell align="left">
                        {invoice.studentId} - {invoice.studentInfo?.titleInfo.title.EN}{" "}
                        {invoice.studentInfo?.firstName}
                    </TableCell>
                    <TableCell align="right">
                        {invoice.totalPrice.toLocaleString("en-US")}
                    </TableCell>
                    <TableCell align="right">
                        {invoice.dueAmount.toLocaleString("en-US")}
                    </TableCell>
                    <TableCell align="center">
                        <Box
                            sx={{
                                backgroundColor: invoice.statusInfo.color,
                                color: "#fff",
                                fontSize: "8px",
                                fontWeight: "bold",
                                borderRadius: "20px",
                                px: 1,
                                py: 0.5,
                                display: "inline-block",
                            }}
                        >
                            {invoice.statusInfo.title.EN}
                        </Box>
                    </TableCell>
                    <TableCell align="right">
                        <IconButton onClick={() => handlePreviewClick(invoice)}>
                            <RemoveRedEyeIcon fontSize="small" />
                        </IconButton>
                    </TableCell>
                </TableRow>
            </React.Fragment>
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
                            <TableCell
                                align="right"
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: 12,
                                    backgroundColor: "#fff",
                                    borderBottom: "1px solid #ddd",
                                }}
                            >
                                Actions
                            </TableCell>
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

            {/* Preview Modal */}
            <Dialog
                open={openPreviewModal}
                onClose={() => setOpenPreviewModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    {selectedInvoice && (
                        <Invoice
                            invoice={selectedInvoice}
                            setIsModalOpen={setOpenPreviewModal}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default InvoicesTable;