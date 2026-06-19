"use client";

import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';

import { InvoiceTableProps } from '../invoice.types';
import { updateInvoiceStatus } from '../services/invoice.services';


const CommissionPaidTable: React.FC<InvoiceTableProps> = ({
    totalRows,
    invoices,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
    reloadData
}) => {
    const theme = useTheme();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingInvoiceId, setLoadingInvoiceId] = useState<number | null>(null);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);

    const handleCommissionPaid = async (invoiceId: number) => {
        setLoadingInvoiceId(invoiceId);

        try {
            const response = await updateInvoiceStatus(invoiceId, 3);

            if (response.success) {
                toast.success(response.success);
                reloadData();
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error("An error occurred while paid commission.")
        } finally {
            setLoadingInvoiceId(null);
            setIsModalOpen(false);
        }
    };

    const handleOpenModal = (invoiceId: number) => {
        setSelectedInvoiceId(invoiceId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedInvoiceId(null);
    };

    const columns = [
        { label: "Invoice ID (INV)", key: "id", width: "10%", align: "center" as const },
        { label: "Date", key: "invoiceDate", width: "15%", align: "left" as const },
        { label: "Student Name", key: "studentName", width: "25%", align: "left" as const },
        { label: "Total Price (LKR)", key: "totalPrice", width: "15%", align: "right" as const },
        { label: "Due Amount (LKR)", key: "dueAmount", width: "15%", align: "right" as const },
        { label: "Status", key: "status", width: "10%", align: "center" as const },
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
                    <TableCell align="center">
                        <Skeleton variant="text" />
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
                <TableCell align="center">INV-{invoice.id}</TableCell>
                <TableCell align="left">{invoice.invoiceDate}</TableCell>
                <TableCell align="left">
                    {invoice.studentInfo?.titleInfo.title.EN}{" "}
                    {invoice.studentInfo?.firstName} {invoice.studentInfo?.lastName}
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
                            fontSize: "10px",
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
                <TableCell align="center">
                    <Button
                        sx={{ fontSize: "10px" }}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenModal(invoice.id)}
                        disabled={loadingInvoiceId === invoice.id}
                    >
                        {loadingInvoiceId === invoice.id ? "Updating..." : "Commission paid"}
                    </Button>
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
                                align="center"
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

            {/* Confirm Update Modal */}
            <Dialog
                open={isModalOpen}
                onClose={handleCloseModal}
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
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <DialogTitle
                        sx={{
                            padding: "16px 24px",
                            fontWeight: "bold",
                            color: theme.palette.text.primary,
                        }}
                    >
                        Confirm Update
                    </DialogTitle>
                    <CloseIcon
                        data-testid="CloseIcon"
                        sx={{ width: 15, height: 15, marginRight: 3, cursor: "pointer" }}
                        onClick={handleCloseModal}
                    />
                </Box>
                <DialogContent>
                    <Typography>
                        Are you sure you want to mark this invoice as Commission paid?
                    </Typography>
                </DialogContent>
                <DialogActions
                    sx={{
                        padding: "16px 24px",
                        gap: "8px",
                        backgroundColor: theme.palette.background.paper,
                    }}
                >
                    <Button
                        onClick={handleCloseModal}
                        sx={{
                            backgroundColor: "#f5f5f5",
                            color: "#555",
                            borderRadius: "5px",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#e0e0e0" },
                            width: "200px",
                        }}
                    >
                        No
                    </Button>
                    <Button
                        onClick={() => selectedInvoiceId && handleCommissionPaid(selectedInvoiceId)}
                        color="primary"
                        autoFocus
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: "#1976d2",
                            borderRadius: "5px",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#115293" },
                            width: "200px",
                        }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CommissionPaidTable;