"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

import { LeadDataType, LeadStatusDataType } from "../leads.types";
import { updateInvoiceStatus, getLeadStatuses } from "../leads.service";
import { getCookieUser } from "@/utils/cookie.util";
import { logActivity } from "@/utils/logActivity";

interface Props {
    open: boolean;
    onClose: () => void;
    lead: LeadDataType | null;
    onSuccess: () => void;
}

const LeadStatusModal: React.FC<Props> = ({
    open,
    onClose,
    lead,
    onSuccess,
}) => {
    const [status, setStatus] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [statusList, setStatusList] = useState<LeadStatusDataType[]>([]);
    const user = getCookieUser();

    // set current lead status
    useEffect(() => {
        if (lead?.status) {
            setStatus(lead.status);
        }

        if (open && user && lead) {
            logActivity({
                userId: user.id,
                action: "LEAD_STATUS_MODAL_OPEN",
                path: "/modules/leads/ui/LeadStatusModal",
                method: "CLIENT",
                meta: {
                    leadId: lead.id,
                    currentStatus: lead.status,
                }
            });
        }
    }, [lead, open]);


    // load statuses
    useEffect(() => {
        if (!open) return;

        const fetchStatuses = async () => {
            try {
                setFetching(true);

                const res = await getLeadStatuses();

                if (res.success) {
                    setStatusList(res.leadStatuses);
                } else {
                    toast.error(res.message);
                }
            } catch (error) {
                toast.error("Failed to load statuses");
            } finally {
                setFetching(false);
            }
        };

        fetchStatuses();
    }, [open]);

    const handleUpdate = async () => {
        if (!lead) return;

        try {
            setLoading(true);

            const previousStatus = lead.status;

            const res = await updateInvoiceStatus(
                lead.id,
                status
            );

            if (res.success) {
                toast.success(res.message);

                if (user) {
                    logActivity({
                        userId: user.id,
                        action: "LEAD_STATUS_UPDATED",
                        path: "/modules/leads/ui/LeadStatusModal",
                        endpoint: "/api/lead/update-status",
                        method: "POST",
                        meta: {
                            leadId: lead.id,
                            from: previousStatus,
                            to: status,
                        }
                    });
                }

                onSuccess();
                onClose();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (user && lead) {
            logActivity({
                userId: user.id,
                action: "LEAD_STATUS_MODAL_CANCEL",
                path: "/modules/leads/ui/LeadStatusModal",
                method: "CLIENT",
                meta: {
                    leadId: lead.id,
                }
            });
        }

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    pt: 2,
                }}
            >
                <DialogTitle sx={{ p: 0 }}>
                    Update Lead Status
                </DialogTitle>

                <CloseIcon
                    onClick={onClose}
                    sx={{ cursor: "pointer" }}
                />
            </Box>

            <DialogContent>
                <Typography fontSize={12} mb={1}>
                    Select Status
                </Typography>

                <Select
                    fullWidth
                    size="small"
                    value={status}
                    onChange={(e) =>
                        setStatus(Number(e.target.value))
                    }
                    disabled={fetching}
                >
                    {statusList.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        backgroundColor: item.color,
                                    }}
                                />
                                {item.title.EN}
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>

            <DialogActions
                sx={{
                    padding: "16px 24px",
                    gap: "8px",
                    position: "sticky",
                    bottom: 0,
                    zIndex: 1000,
                }}
            >
                <Button
                    onClick={handleClose}
                    color="secondary"
                    sx={{
                        backgroundColor: "#f5f5f5",
                        color: "#555",
                        borderRadius: "5px",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#e0e0e0" },
                        width: "200px"
                    }}
                >
                    Cancel
                </Button>

                <Button
                    onClick={handleUpdate}
                    variant="contained"
                    fullWidth
                    disabled={loading || fetching}
                    color="primary"
                    sx={{
                        backgroundColor: "#1976d2",
                        borderRadius: "5px",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#115293" },
                        width: "200px"
                    }}
                >
                    {loading ? "Updating..." : "Update Status"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LeadStatusModal;