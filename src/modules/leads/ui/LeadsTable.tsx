"use client";

import React, { useState } from "react";
import {
    Box,
    IconButton,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import LeadStatusModal from "./LeadStatusModal";
import { LeadDataType, LeadsTableProps } from "../leads.types";

import { getCookieUser } from "@/utils/cookie.util";
import { logActivity } from "@/utils/logActivity";

const LeadsTable: React.FC<LeadsTableProps> = ({
    totalRows,
    leads,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
}) => {
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<LeadDataType | null>(null);
    const user = getCookieUser()

    const columns = [
        { label: "Lead ID", key: "id", width: "5%", align: "center" as const },
        { label: "Student", key: "student", width: "25%", align: "left" as const },
        { label: "University & Course", key: "university", width: "35%", align: "left" as const },
        { label: "Staff", key: "staff", width: "25%", align: "left" as const },
        { label: "Status", key: "status", width: "5%", align: "center" as const },
        { label: "", key: "actions", width: "5%", align: "center" as const },
    ];

    const toggleExpandRow = (leadId: number) => {
        setExpandedRows((prev) =>
            prev.includes(leadId)
                ? prev.filter((id) => id !== leadId)
                : [...prev, leadId]
        );

        logActivity({
            userId: user ? user.id : 0,
            action: "LEAD_ROW_EXPAND",
            path: "/modules/leads/ui/LeadsTable",
            method: "CLIENT",
            meta: {
                leadId
            }
        });
    };

    const expandedContent = (lead: LeadDataType) => (
        <Box sx={{ p: 3 }}>
            <Typography
                variant="subtitle1"
                fontWeight={600}
                mb={2}
            >
                Lead Information
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr 1fr",
                    },
                    gap: 2,
                }}
            >
                {[
                    {
                        label: "Lead ID",
                        value: lead.id,
                    },
                    {
                        label: "Status",
                        value: lead.statusInfo?.title?.EN,
                    },
                    {
                        label: "Student",
                        value: `${lead.studentInfo?.firstName || ""} ${lead.studentInfo?.lastName || ""
                            }`,
                    },
                    {
                        label: "Student Email",
                        value: lead.studentInfo?.email,
                    },
                    {
                        label: "Staff",
                        value:
                            lead.staffInfo?.fullName ||
                            `${lead.staffInfo?.firstName || ""} ${lead.staffInfo?.lastName || ""
                            }`,
                    },
                    {
                        label: "Staff Email",
                        value: lead.staffInfo?.email,
                    },
                    {
                        label: "University",
                        value: lead.courseInfo.universityInfo?.name,
                    },
                    {
                        label: "University Email",
                        value: lead.courseInfo.universityInfo?.email,
                    },
                    {
                        label: "Note",
                        value: lead.note,
                    },
                ].map((item) => (
                    <Box
                        key={item.label}
                    >
                        <Typography
                            fontSize={11}
                            color="text.secondary"
                        >
                            {item.label}
                        </Typography>

                        <Typography
                            fontSize={14}
                            fontWeight={600}
                        >
                            {item.value || "-"}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );

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

        if (!leads.length) {
            return (
                <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        align="center"
                        sx={{ py: 4 }}
                    >
                        No leads available
                    </TableCell>
                </TableRow>
            );
        }

        return leads.map((lead, index) => (
            <React.Fragment key={lead.id}>
                <TableRow
                    sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
                >
                    {/* Lead ID */}
                    <TableCell align="center">
                        #{lead.id}
                    </TableCell>

                    {/* Student */}
                    <TableCell>
                        {lead.studentInfo?.fullName ||
                            `${lead.studentInfo?.firstName || ""} ${lead.studentInfo?.lastName || ""
                            }`}
                    </TableCell>

                    {/* University */}
                    <TableCell>
                        {lead.courseInfo?.universityInfo?.name || "-"} -  {lead.courseInfo?.title || "-"}
                    </TableCell>

                    {/* Staff */}
                    <TableCell>
                        {lead.staffInfo?.fullName ||
                            `${lead.staffInfo?.firstName || ""} ${lead.staffInfo?.lastName || ""
                            }`}
                    </TableCell>
                    {/* Status */}
                    <TableCell align="center">
                        <Box
                            onClick={
                                user && user?.roll === 1
                                    ? () => {
                                        setSelectedLead(lead);
                                        setStatusModalOpen(true);

                                        logActivity({
                                            userId: user.id,
                                            action: "LEAD_STATUS_CLICK",
                                            path: "/modules/leads/ui/LeadsTable",
                                            method: "CLIENT",
                                            meta: {
                                                leadId: lead.id,
                                                currentStatus: lead.statusInfo?.title?.EN
                                            }
                                        });
                                    }
                                    : undefined
                            }
                            sx={{
                                backgroundColor: lead.statusInfo?.color || "#1976d2",
                                color: "#fff",
                                fontSize: "11px",
                                fontWeight: 600,
                                borderRadius: "20px",
                                px: 1.5,
                                py: 0.5,
                                minWidth: 80,
                                textAlign: "center",
                                display: "inline-block",
                                cursor: user && user?.roll === 1 ? "pointer" : "default",
                            }}
                        >
                            {lead.statusInfo?.title?.EN || "-"}
                        </Box>
                    </TableCell>
                    {/* Expand */}
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            onClick={() => toggleExpandRow(lead.id)}
                        >
                            <ExpandMoreIcon
                                sx={{
                                    transition: "0.3s",
                                    transform: expandedRows.includes(lead.id)
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                }}
                            />
                        </IconButton>
                    </TableCell>
                </TableRow>

                {
                    expandedRows.includes(lead.id) && (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                sx={{
                                    backgroundColor: "#f8fafc",
                                    p: 0,
                                }}
                            >
                                {expandedContent(lead)}
                            </TableCell>
                        </TableRow>
                    )
                }
            </React.Fragment >
        ));
    };

    return (
        <>
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
                        "& th": {
                            fontWeight: "bold",
                            fontSize: 12,
                            borderBottom: "1px solid #ddd",
                            py: 1,
                            backgroundColor: "#fff",
                        },
                        "& td": { fontSize: 12, py: 1 },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.key}
                                    align={col.align}
                                    sx={{
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
                component="div"
                count={totalRows}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15, 25]}
                onPageChange={(_, newPage) =>
                    onPageChange(newPage)
                }
                onRowsPerPageChange={(e) =>
                    onRowsPerPageChange(
                        parseInt(e.target.value, 10)
                    )
                }
            />

            <LeadStatusModal
                open={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                lead={selectedLead}
                onSuccess={() => {
                    window.location.reload(); // or call your API refetch function
                }}
            />
        </>
    );
};

export default LeadsTable;