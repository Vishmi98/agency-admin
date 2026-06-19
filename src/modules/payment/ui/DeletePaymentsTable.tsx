"use client";

import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { toast } from 'react-toastify';
import { Delete } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

import Payment from './Payment';
import { PaymentDataType, PaymentTableProps } from '../payment.types';
import { deletePayment } from '../services/payment.services';


const DeletePaymentsTable: React.FC<PaymentTableProps> = ({
    totalRows,
    payments,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
    selectedPayment,
    setSelectedPayment,
    reloadData
}) => {
    const theme = useTheme();

    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loadingPaymentId, setLoadingPaymentId] = useState<number | null>(null);
    const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);

    const handlePreviewClick = (payment: PaymentDataType) => {
        setSelectedPayment(payment);
        setIsPreviewModalOpen(true);
    };

    const handleDeleteClick = (paymentId: number) => {
        setSelectedPaymentId(paymentId);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedPaymentId(null);
    };

    const handleDelete = async (paymentId: number) => {
        setLoadingPaymentId(paymentId);

        try {
            const response = await deletePayment(paymentId);

            if (response.success) {
                toast.success(response.success);
                reloadData();
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error("An error occurred while deleting payment")
        } finally {
            setLoadingPaymentId(null);
            setIsDeleteModalOpen(false);
        }
    };

    const columns = [
        { label: "Payment ID (PAY)", key: "id", width: "10%", align: "center" as const },
        { label: "Invoice ID (INV)", key: "invoiceId", width: "10%", align: "center" as const },
        { label: "Date", key: "paymentDate", width: "15%", align: "left" as const },
        { label: "Staff Name", key: "staff", width: "20%", align: "left" as const },
        { label: "Student Name", key: "studentName", width: "20%", align: "left" as const },
        { label: "Payment Type", key: "paymentType", width: "15%", align: "left" as const },
        { label: "Amount (LKR)", key: "amount", width: "10%", align: "right" as const },
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

        if (!payments.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return payments.map((payment, index) => (
            <TableRow
                key={payment.id}
                sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
            >
                <TableCell align="center">{payment.id}</TableCell>
                <TableCell align="center">{payment.invoiceId}</TableCell>
                <TableCell align="left">{payment.paymentDate}</TableCell>
                <TableCell align="left">{payment.staffInfo?.fullName}</TableCell>
                <TableCell align="left">{payment.studentInfo?.fullName || ""}</TableCell>
                <TableCell align="left">{payment.paymentTypeInfo?.title.EN}</TableCell>
                <TableCell align="right">
                    {payment.amountLkr.toLocaleString("en-US")}
                </TableCell>
                <TableCell align="right">
                    <RemoveRedEyeIcon color='primary' aria-label="preview-button" sx={{ fontSize: 20, cursor: "pointer" }} onClick={() => handlePreviewClick(payment)} />
                </TableCell>
                <TableCell align="right">
                    <Delete
                        color='error'
                        sx={{ fontSize: 20, cursor: "pointer" }}
                        onClick={() => handleDeleteClick(payment.id)}
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
                onRowsPerPageChange={(e) =>
                    onRowsPerPageChange(parseInt(e.target.value, 10))
                }
            />

            {/* Preview Modal */}
            <Dialog
                open={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    {selectedPayment && (
                        <Payment
                            payment={selectedPayment}
                            setIsModalOpen={setIsPreviewModalOpen}
                        />
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
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <DialogTitle sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                        Confirm Delete
                    </DialogTitle>
                    <IconButton onClick={handleCloseDeleteModal} sx={{ mr: 2 }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <DialogContent>
                    <Typography>Are you sure you want to delete this payment?</Typography>
                </DialogContent>
                <DialogActions sx={{ gap: 1, px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCloseDeleteModal}
                        sx={{ backgroundColor: "#f5f5f5", color: "#555", "&:hover": { backgroundColor: "#e0e0e0" } }}
                    >
                        No
                    </Button>
                    <Button
                        onClick={() => selectedPaymentId && handleDelete(selectedPaymentId)}
                        disabled={loadingPaymentId !== null}
                        variant="contained"
                        color="primary"
                    >
                        {loadingPaymentId !== null ? "Deleting..." : "Yes"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DeletePaymentsTable;