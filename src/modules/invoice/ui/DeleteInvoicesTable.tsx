"use client";

import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from 'react-toastify';

import Invoice from './Invoice';
import { InvoiceDataType, InvoiceTableProps } from '../invoice.types';
import { deleteInvoice } from '../services/invoice.services';


const DeleteInvoicesTable: React.FC<InvoiceTableProps> = ({
    totalRows,
    invoices,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
    selectedInvoice,
    setSelectedInvoice,
    reloadData
}) => {
    const theme = useTheme();

    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loadingInvoiceId, setLoadingInvoiceId] = useState<number | null>(null);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);

    const handlePreviewClick = (invoice: InvoiceDataType) => {
        setSelectedInvoice(invoice);
        setIsPreviewModalOpen(true);
    };

    const handleDeleteClick = (invoiceId: number) => {
        setSelectedInvoiceId(invoiceId);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedInvoiceId(null);
    };

    const handleDelete = async (invoiceId: number) => {
        setLoadingInvoiceId(invoiceId);

        try {
            const response = await deleteInvoice(invoiceId);

            if (response.success) {
                toast.success(response.success);
                reloadData();
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error("An error occurred while deleting invoice")
        } finally {
            setLoadingInvoiceId(null);
            setIsDeleteModalOpen(false);
        }
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
                    <TableCell align="right">
                        <Skeleton variant="circular" width={24} height={24} />
                    </TableCell>
                     <TableCell align="right">
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
            <TableRow
                key={invoice.id}
                sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
            >
                <TableCell align="center">{invoice.id}</TableCell>
                <TableCell align="left">{invoice.invoiceDate}</TableCell>
                <TableCell align="left">{invoice.packageInfo?.title}</TableCell>
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
                    <RemoveRedEyeIcon color='primary' aria-label="preview-button" sx={{ fontSize: 20, cursor: "pointer" }} onClick={() => handlePreviewClick(invoice)} />
                </TableCell>
                <TableCell align="right">
                    <DeleteIcon
                        color='error'
                        sx={{ fontSize: 20, cursor: "pointer" }}
                        onClick={() => handleDeleteClick(invoice.id)}
                    />
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
                            <TableCell
                                align="right"
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: 12,
                                    backgroundColor: "#fff",
                                    borderBottom: "1px solid #ddd",
                                }}
                            >
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: 12,
                                    backgroundColor: "#fff",
                                    borderBottom: "1px solid #ddd",
                                }}
                            >
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
                open={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    {selectedInvoice && (
                        <Invoice invoice={selectedInvoice} setIsModalOpen={setIsPreviewModalOpen} />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    style: {
                        borderRadius: "10px",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                        backgroundColor: theme.palette.background.paper,
                    },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <DialogTitle
                        sx={{
                            fontWeight: "bold",
                            color: theme.palette.text.primary,
                        }}
                    >
                        Confirm Delete
                    </DialogTitle>
                    <IconButton onClick={handleCloseDeleteModal} sx={{ mr: 2 }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <DialogContent>
                    <Typography>Are you sure you want to delete this invoice?</Typography>
                </DialogContent>
                <DialogActions sx={{ gap: 1, px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCloseDeleteModal}
                        sx={{ backgroundColor: "#f5f5f5", color: "#555", "&:hover": { backgroundColor: "#e0e0e0" } }}
                    >
                        No
                    </Button>
                    <Button
                        onClick={() => selectedInvoiceId && handleDelete(selectedInvoiceId)}
                        disabled={loadingInvoiceId !== null}
                        variant="contained"
                        color="primary"
                    >
                        {loadingInvoiceId !== null ? "Deleting..." : "Yes"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DeleteInvoicesTable;