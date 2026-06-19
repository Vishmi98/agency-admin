"use client"

import React, { useEffect, useState } from "react";
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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Autocomplete,
    TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';

import { SubCommissionDataType, SubCommissionTableProps } from "../commission.types";
import { changeStaff, updateAvailableToPaid } from "../service/commission.service";

import { StaffDataType } from "@/modules/staff/staff.types";
import { getStaffData } from "@/modules/staff/services/staff.services";


const columns = [
    { label: "Commission ID", key: "commissionId", width: "15%", align: "left" as const },
    { label: "Invoice ID (INV)", key: "invoiceId", width: "20%", align: "left" as const },
    { label: "Staff ID", key: "staffId", width: "20%", align: "left" as const },
    { label: "Month", key: "month", width: "15%", align: "left" as const },
    { label: "Amount (LKR)", key: "amount", width: "15%", align: "right" as const },
    { label: "Status", key: "status", width: "10%", align: "center" as const },
    { label: "Change Staff", key: "changeStaff", width: "10%", align: "center" as const },
];

const SubCommissionsTable: React.FC<SubCommissionTableProps> = ({
    totalRows,
    subCommissions,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
    reloadData
}) => {
    const [staffs, setStaffs] = useState<StaffDataType[]>([]);
    const [selectedStaffId, setSelectedStaffId] = useState<number | "">("");

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCommission, setSelectedCommission] = useState<SubCommissionDataType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dialog state for Paid confirmation
    const [isPaidDialogOpen, setIsPaidDialogOpen] = useState(false);
    const [selectedPaidCommission, setSelectedPaidCommission] = useState<SubCommissionDataType | null>(null);

    useEffect(() => {
        if (isDialogOpen) {
            (async () => {
                try {
                    const response = await getStaffData(1, 1000);
                    if (response?.success) {
                        setStaffs(response.staffs);
                        setSelectedStaffId(selectedCommission?.staffId || "");
                    }
                } catch (error) {
                    console.error("Error fetching staff list", error);
                    toast.error("Unable to fetch staff members");
                }
            })();
        }
    }, [isDialogOpen, selectedCommission]);

    const handleOpenModal = (subCommission: SubCommissionDataType) => {
        setSelectedCommission(subCommission);
        setIsDialogOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedCommission(null);
        setIsDialogOpen(false);
    };


    const handleChangeStaffMember = async () => {
        if (!selectedCommission || selectedStaffId === "") return;

        setIsSubmitting(true);

        try {
            const response = await changeStaff(selectedCommission.commissionId, selectedCommission.month, selectedStaffId);
            if (response.success) {
                toast.success(response.message);
                reloadData();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Error changing staff:", error);
            toast.error("Server error. Please try again.");
        } finally {
            setIsSubmitting(false);
            handleCloseModal();
        }
    };

    const getNextStatusLabel = (status: SubCommissionDataType["status"]) => {
        switch (status) {
            case "available":
                return "Paid";
            case "paid":
                return null;
        }
    };

    // Paid Modal handlers
    const handleOpenPaidModal = (subCommission: SubCommissionDataType) => {
        setSelectedPaidCommission(subCommission);
        setIsPaidDialogOpen(true);
    };

    const handleClosePaidModal = () => {
        setSelectedPaidCommission(null);
        setIsPaidDialogOpen(false);
    };

    const handleConfirmPaid = async () => {
        if (!selectedPaidCommission) return;

        setIsSubmitting(true);

        try {
            const response = await updateAvailableToPaid(
                selectedPaidCommission.commissionId,
                selectedPaidCommission.month
            );

            if (response.success) {
                toast.success(response.message || "Commission marked as Paid");
                reloadData(); // refresh the table after success
                handleClosePaidModal();
            } else {
                toast.error(response.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status to Paid:", error);
            toast.error("Server error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderRows = () => {
        if (isLoading) {
            return Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    {columns.map((col) => (
                        <TableCell key={col.key} align={col.align} sx={{ width: col.width }}>
                            <Skeleton variant="text" />
                        </TableCell>
                    ))}
                </TableRow>
            ));
        }

        if (!subCommissions.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return subCommissions.map((data, index) => {
            const nextStatusLabel = getNextStatusLabel(data.status);

            return (
                <TableRow
                    key={data.id}
                    sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
                >
                    <TableCell align="left">{data.commissionId}</TableCell>
                    <TableCell align="left">{data.mainCommissionInfo?.invoiceId} - {data.mainCommissionInfo?.staffDetails?.firstName}</TableCell>
                    <TableCell align="left">{data.staffId} - {data.staffInfo?.firstName}</TableCell>
                    <TableCell align="left">{data.month}</TableCell>
                    <TableCell align="right">{data.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell align="center">
                        {nextStatusLabel ? (
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleOpenPaidModal(data)}
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
                    <TableCell align="center">
                        {data.status === "available" ? (
                            <Button
                                onClick={() => handleOpenModal(data)}
                                variant="contained"
                                size="small"
                            >
                                Change
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                size="small"
                                disabled
                            >
                                Change
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
                        Change Staff member
                    </DialogTitle>
                    <CloseIcon sx={{ width: 15, height: 15, marginRight: 3, cursor: "pointer" }} onClick={handleCloseModal} />
                </Box>
                <DialogContent>
                    <Typography fontSize="12px">Select Staff Member</Typography>
                    <Autocomplete
                        options={staffs}
                        getOptionLabel={(option) => option.fullName}
                        loading={isLoading}
                        size="small"
                        value={staffs.find(s => s.id === selectedStaffId) || null}
                        onChange={(_, newValue) => setSelectedStaffId(newValue?.id || 0)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Search Staff..."
                                fullWidth
                            />
                        )}
                    />
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
                        onClick={handleChangeStaffMember}
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

            {/* Paid Confirmation Dialog */}
            <Dialog
                open={isPaidDialogOpen}
                onClose={handleClosePaidModal}
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
                    <CloseIcon sx={{ width: 15, height: 15, marginRight: 3, cursor: "pointer" }} onClick={handleClosePaidModal} />
                </Box>
                <DialogContent>
                    <Typography>
                        Are you sure you want to mark{" "}
                        as{" "}
                        <strong>Paid</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ padding: "16px 24px", gap: "8px" }}>
                    <Button
                        onClick={handleClosePaidModal}
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
                        onClick={handleConfirmPaid}
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

export default SubCommissionsTable;
