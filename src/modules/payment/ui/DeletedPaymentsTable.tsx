"use client";

import React, { useState } from 'react';
import { Box, Dialog, DialogContent, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import Payment from './Payment';
import { PaymentDataType, PaymentTableProps } from '../payment.types';


const DeletedPaymentsTable: React.FC<PaymentTableProps> = ({
    totalRows,
    payments,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
    selectedPayment,
    setSelectedPayment,
}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePreviewClick = (payment: PaymentDataType) => {
        setSelectedPayment(payment);
        setIsModalOpen(true);
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
                <TableCell align="right">{payment.amountLkr.toLocaleString("en-US")}</TableCell>
                <TableCell align="right">
                    <RemoveRedEyeIcon
                        color="primary"
                        aria-label="preview-button"
                        sx={{ fontSize: 20, cursor: "pointer" }}
                        onClick={() => handlePreviewClick(payment)}
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
                onRowsPerPageChange={(e) =>
                    onRowsPerPageChange(parseInt(e.target.value, 10))
                }
            />

            {/* Preview Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
                <DialogContent>
                    {selectedPayment && (
                        <Payment payment={selectedPayment} setIsModalOpen={setIsModalOpen} />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default DeletedPaymentsTable;