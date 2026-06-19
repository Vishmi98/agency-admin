"use client"

import React, { useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Paper,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-toastify";

import { MainCommissionDataType, MainCommissionTableProps, UpdateIntroduceAmountPaidResponseDataType } from "../commission.types";
import { updateStatus, updateStatusToPaid } from "../service/commission.service";


const columns = [
    { label: "Invoice ID (INV)", key: "invoiceId", width: "10%", align: "left" as const },
    { label: "Date", key: "date", width: "10%", align: "left" as const },
    { label: "Staff ID", key: "staffId", width: "10%", align: "left" as const },
    { label: "Amount (LKR)", key: "amount", width: "10%", align: "right" as const },
    { label: "Percentage (%)", key: "percentage", width: "10%", align: "right" as const },
    // { label: "Due", key: "dueAmount", width: "10%", align: "right" as const },
    // { label: "Paid", key: "paidAmount", width: "10%", align: "right" as const },
    { label: "Intro Amt (LKR)", key: "introduceAmount", width: "10%", align: "right" as const },
    { label: "Monthly Amt (LKR)", key: "monthlyAmount", width: "10%", align: "right" as const },
    { label: "Status", key: "status", width: "10%", align: "center" as const },
];

const MainCommissionsTable: React.FC<MainCommissionTableProps> = ({
    totalRows,
    mainCommissions,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
    reloadData
}) => {
    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCommission, setSelectedCommission] = useState<MainCommissionDataType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getNextStatusLabel = (status: MainCommissionDataType["status"]) => {
        switch (status) {
            case "pending":
                return "Available";
            case "available":
                return "Paid";
            case "paid":
                return null;
        }
    };

    const handleOpenModal = (commission: MainCommissionDataType) => {
        setSelectedCommission(commission);
        setIsDialogOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedCommission(null);
        setIsDialogOpen(false);
    };

    const handleConfirmUpdate = async () => {
        if (!selectedCommission) return;
        setIsSubmitting(true);

        try {
            let updatedCommission: UpdateIntroduceAmountPaidResponseDataType | null = null;

            if (selectedCommission.status === "pending") {
                updatedCommission = await updateStatus(selectedCommission.id);
            } else if (selectedCommission.status === "available") {
                updatedCommission = await updateStatusToPaid(selectedCommission.id);
            }

            if (updatedCommission?.success) {
                toast.success(updatedCommission.message || "Status updated successfully");
                reloadData();
            } else {
                toast.error(updatedCommission?.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Server error. Please try again.");
        } finally {
            setIsSubmitting(false);
            handleCloseModal();
        }
    };

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

        if (!mainCommissions.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return mainCommissions.map((data, index) => {
            const nextStatusLabel = getNextStatusLabel(data.status);
            return (
                <TableRow
                    key={data.id}
                    sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
                >
                    <TableCell align="left">{data.invoiceId} - {data?.staffDetails?.firstName}</TableCell>
                    <TableCell align="left">
                        {data.date ? new Date(data.date).toLocaleDateString("en-CA") : ""}
                    </TableCell>
                    <TableCell align="left">{data.staffId} - {data?.staffDetails?.firstName}</TableCell>
                    <TableCell align="right">{data.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell align="right">{data.percentage.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    {/* <TableCell align="right">{data.dueAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell align="right">{data.paidAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell> */}
                    <TableCell align="right">{data.introduceAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell align="right">
                        {(data.monthlyAmount / 12).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="center">
                        {nextStatusLabel ? (
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleOpenModal(data)}
                            >
                                {nextStatusLabel}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                size="small"
                                disabled
                            >
                                Paid
                            </Button>
                        )}
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <Box>
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{ maxHeight: 370, overflowY: "auto", borderRadius: "5px" }}
            >
                <Table
                    stickyHeader
                    sx={{
                        minWidth: 700,
                        borderCollapse: "collapse",
                        "& th": { fontWeight: "bold", fontSize: "12px", borderBottom: "1px solid #ddd", py: 1 },
                        "& td": { fontSize: "12px", py: 1 },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            {columns.map(col => (
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
                page={page}
                onPageChange={(e, newPage) => onPageChange(newPage)}
                onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
            />

            {/* Confirmation Dialog */}
            <Dialog
                open={isDialogOpen}
                onClose={handleCloseModal}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    style: {
                        borderRadius: "10px",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <DialogTitle
                        sx={{
                            padding: "16px 24px",
                            fontWeight: "bold",
                        }}
                    >
                        Confirm Status Update
                    </DialogTitle>
                    <CloseIcon sx={{ width: 15, height: 15, marginRight: 3, cursor: "pointer" }} onClick={handleCloseModal} />
                </Box>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to update the status of &apos;INV {selectedCommission?.invoiceId}&apos; to{" "}
                        {getNextStatusLabel(selectedCommission?.status!)}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: "16px 24px", gap: "8px" }}>
                    <Button
                        onClick={handleCloseModal}
                        disabled={isSubmitting}
                        color="secondary"
                        sx={{
                            backgroundColor: "#f5f5f5",
                            color: "#555",
                            borderRadius: "5px",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#e0e0e0" },
                            width: "200px",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmUpdate}
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            backgroundColor: "#1976d2",
                            borderRadius: "5px",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#115293" },
                            width: "200px",
                        }}
                    >
                        {isSubmitting ? "Updating..." : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MainCommissionsTable;
