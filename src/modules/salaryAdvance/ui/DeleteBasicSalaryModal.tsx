"use client";

import React from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { toast } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';

import { deleteBasicSalary } from "../service/salaryAdvance.service";
import { DeleteBasicSalaryModalProps } from "../salaryAdvance.types";


const DeleteBasicSalaryModal: React.FC<DeleteBasicSalaryModalProps> = ({
    isOpen,
    onClose,
    selectedData,
    reloadData,
}) => {
    const handleDelete = async () => {
        if (!selectedData || selectedData.roll === undefined) return;

        try {
            const res = await deleteBasicSalary(Number(selectedData.roll)); // Ensuring it's a number
            if (res.success) {
                toast.success(res.message || "Deleted successfully!");
                reloadData();
                onClose();
            } else {
                toast.error(res.message || "Failed to delete!");
            }
        } catch (error) {
            toast.error("An error occurred while deleting.");
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
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
                    Delete Basic Salary
                </DialogTitle>
                <CloseIcon data-testid="CloseIcon" sx={{ width: 15, height: 15, marginRight: 3 }} onClick={onClose} />
            </Box>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete the basic salary for{" "}
                    <strong>{selectedData?.title}</strong>?
                </DialogContentText>
            </DialogContent>
            <DialogActions
                sx={{
                    gap: "8px",
                    position: "sticky",
                    bottom: 0,
                    zIndex: 1000,
                    p: 3
                }}
            >
                <Button
                    color="secondary"
                    sx={{
                        backgroundColor: "#f5f5f5",
                        color: "#555",
                        borderRadius: "5px",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#e0e0e0" },
                        width: "100%"
                    }}
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                    sx={{
                        borderRadius: "5px",
                        textTransform: "none",
                        width: "100%"
                    }}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteBasicSalaryModal;
