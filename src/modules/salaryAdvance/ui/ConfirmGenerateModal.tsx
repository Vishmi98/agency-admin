"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    useTheme,
    Box,
    TextField,
    IconButton,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { ConfirmGenerateModalProps, SalaryDataType } from "../salaryAdvance.types";
import { createSalary, previewSalary } from "../service/salaryAdvance.service";


const ConfirmGenerateModal: React.FC<ConfirmGenerateModalProps> = ({
    open,
    onClose,
    staffId,
    month,
    onSuccess,
}) => {
    const theme = useTheme();
    const [salaryPreview, setSalaryPreview] = useState<SalaryDataType | null>(null);
    const [loading, setLoading] = useState(false);
    const [additionalIncentives, setAdditionalIncentives] = useState<
        { title: string; amount: number | string }[]
    >([]);

    useEffect(() => {
        if (open && staffId) {
            (async () => {
                setLoading(true);
                try {
                    const response = await previewSalary(staffId, month);
                    if (response.success) {
                        setSalaryPreview(response.salaryPreview);
                    } else {
                        toast.error("Failed to load data");
                        onClose();
                    }
                } catch (error) {
                    toast.error("Error loading salary data");
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [open, staffId, month]);

    const handleGenerate = async () => {
        if (!staffId) return;
        setLoading(true);
        try {
            const validAdditional = additionalIncentives
                .filter((a) => a.title.trim() !== "" && !isNaN(Number(a.amount)))
                .map((a) => ({
                    title: a.title.trim(),
                    amount: parseFloat(a.amount as string),
                }));

            const response = await createSalary(staffId, month, validAdditional);

            if (response.success) {
                toast.success("Salary generated successfully");
                onSuccess(staffId);
                onClose();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to generate salary");
        } finally {
            setLoading(false);
        }
    };

    const additionalTotal = additionalIncentives.reduce((sum, a) => sum + (parseFloat(a.amount as string) || 0), 0);
    const calculatedNetSalary =
        (salaryPreview?.grossSalary || 0) + additionalTotal - (salaryPreview?.totalDeduction || 0);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
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
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                        color: theme.palette.text.primary,
                    }}
                >
                    Generate Salary
                </DialogTitle>
                <CloseIcon
                    data-testid="CloseIcon"
                    sx={{ width: 15, height: 15, marginRight: 3, cursor: "pointer" }}
                    onClick={onClose}
                />
            </Box>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>
                ) : salaryPreview ? (
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2">Basic</Typography>
                            <Typography variant="body2">{salaryPreview.basicSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                        </Box>
                        <Typography variant="body2">Commissions per student ({salaryPreview.commissionAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</Typography>
                        <Typography variant="body2">No pay deduction per day ({salaryPreview.noPayPerDay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) </Typography>
                        {/* <Typography variant="body2">
                            Introduce commission per month ({
                                (salaryPreview?.mainCommissionIds?.length
                                    ? (salaryPreview.mainCommissionAmount / salaryPreview.mainCommissionIds.length).toFixed(2)
                                    : 0)
                            })
                        </Typography>

                        <Typography variant="body2">
                            Maintain commission per month ({
                                (salaryPreview?.subCommissionIds?.length
                                    ? (salaryPreview.subCommissionAmount / salaryPreview.subCommissionIds.length).toFixed(2)
                                    : 0)
                            })
                        </Typography> */}

                        <Box sx={{ width: "100%", height: "1px", backgroundColor: "gray", marginY: 2 }} />

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" fontWeight={700}>Earnings</Typography>
                            <Typography variant="body2" fontWeight={700} textAlign="end">Amount</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" fontWeight='bold'>Introduce commissions ({salaryPreview?.mainCommissionIds.length})</Typography>
                            <Typography variant="body2" textAlign="end">{(salaryPreview.mainCommissionAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                        </Box>
                        {salaryPreview.invoiceIdsWithMainCommission.map((item, index) => (
                            <Box key={index} sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                <Typography variant="body2">{item.id} - {item.studentInfo?.firstName} {item.studentInfo?.lastName}</Typography>
                            </Box>
                        ))}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" fontWeight='bold'>Maintain commissions ({salaryPreview?.subCommissionIds.length})</Typography>
                            <Typography variant="body2" textAlign="end">{(salaryPreview.subCommissionAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                        </Box>
                        {salaryPreview.invoiceIdsWithSubCommission.map((item, index) => (
                            <Box key={index} sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                <Typography variant="body2">{item.id} - {item.studentInfo?.firstName} {item.studentInfo?.lastName}</Typography>
                            </Box>
                        ))}
                        <Box sx={{ width: "100%", height: "1px", backgroundColor: "gray", marginY: 2 }} />

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" fontWeight={700}>Deductions</Typography>
                            <Typography variant="body2" fontWeight={700} textAlign="end">Amount</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2">Salary Advances</Typography>
                            {salaryPreview.salaryAdvance && salaryPreview.salaryAdvance.length > 0 ? (
                                salaryPreview.salaryAdvance.map((amount, index) => (
                                    <Typography key={index} variant="body2">
                                        - {amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Typography>
                                ))
                            ) : (
                                <Typography variant="body2">0</Typography>
                            )}
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2">No Pay Deduction ({salaryPreview?.leaves.length})</Typography>
                            <Typography variant="body2">- {salaryPreview.totalNoPayDeduction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                        </Box>
                        <Box mt={3}>
                            <Typography variant="body2" fontWeight={700}>Additional Incentives</Typography>

                            {additionalIncentives.map((item, index) => (
                                <Box key={index} display="flex" gap={1} alignItems="center" mt={1}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Title"
                                        value={item.title}
                                        onChange={(e) => {
                                            const updated = [...additionalIncentives];
                                            updated[index].title = e.target.value;
                                            setAdditionalIncentives(updated);
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="number"
                                        placeholder="Amount"
                                        value={item.amount}
                                        onChange={(e) => {
                                            const updated = [...additionalIncentives];
                                            const value = e.target.value;
                                            updated[index].amount = value === "" ? "" : parseFloat(value);
                                            setAdditionalIncentives(updated);
                                        }}
                                    />
                                    <IconButton
                                        aria-label="delete"
                                        size="small"
                                        onClick={() => {
                                            const updated = [...additionalIncentives];
                                            updated.splice(index, 1); // Remove item
                                            setAdditionalIncentives(updated);
                                        }}
                                    >
                                        <CloseIcon sx={{ fontSize: "10px" }} />
                                    </IconButton>
                                </Box>
                            ))}

                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ mt: 1, textTransform: "none", fontSize: "10px" }}
                                onClick={() => setAdditionalIncentives([...additionalIncentives, { title: "", amount: 0 }])}
                            >
                                + Add
                            </Button>
                        </Box>
                        <Box sx={{ width: "100%", display: "flex", flexDirection: "row", marginTop: 2 }}>
                            <Box sx={{ width: "40%" }}></Box>
                            <Box sx={{ width: "60%", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                <Box marginTop={1} sx={{ display: "flex", gap: 5, justifyContent: "space-between", width: "100%" }}>
                                    <Typography variant='body2' fontWeight="bold">Gross Pay:</Typography>
                                    <Typography variant='body2'>{salaryPreview.grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                </Box>
                                <Box marginTop={1} sx={{ display: "flex", gap: 5, justifyContent: "space-between", width: "100%" }}>
                                    <Typography variant='body2' fontWeight="bold">Additional:</Typography>
                                    <Typography variant='body2'>
                                        {additionalIncentives.reduce((sum, a) => sum + Number(a.amount || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </Typography>
                                </Box>
                                <Box marginTop={1} sx={{ display: "flex", gap: 5, justifyContent: "space-between", width: "100%" }}>
                                    <Typography variant='body2' fontWeight="bold">Total Deductions:</Typography>
                                    <Typography variant='body2'>- {salaryPreview.totalDeduction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                </Box>
                                <Box marginTop={1} sx={{ display: "flex", gap: 5, justifyContent: "space-between", width: "100%" }}>
                                    <Typography variant='body2' fontWeight="bold">Net Pay:</Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            textDecoration: 'underline double',
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {calculatedNetSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="body2">No data to preview.</Typography>
                )}
            </DialogContent>
            <DialogActions
                sx={{
                    padding: "16px 24px",
                    gap: "8px",
                    position: "sticky",
                    bottom: 0,
                    backgroundColor: theme.palette.background.paper,
                    zIndex: 1000,
                }}
            >
                <Button
                    onClick={onClose}
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
                    onClick={handleGenerate}
                    color="primary"
                    autoFocus
                    sx={{
                        backgroundColor: "#1976d2",
                        borderRadius: "5px",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#115293" },
                        width: "200px",
                        color: "#fff"
                    }}
                >
                    {loading ? "Generating..." : "Generate"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmGenerateModal;
