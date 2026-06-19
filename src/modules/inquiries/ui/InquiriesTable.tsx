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

import { InquiriesTableProps, InquiryDataType } from "../inquiries.types";

const InquiriesTable: React.FC<InquiriesTableProps> = ({
    totalRows,
    inquiries,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
}) => {
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<InquiryDataType | null>(null);

    const columns = [
        { label: "Inquiry ID", key: "id", width: "10%", align: "center" as const },
        { label: "Student", key: "student", width: "30%", align: "left" as const },
        { label: "Email", key: "email", width: "30%", align: "left" as const },
        { label: "Phone Number", key: "phone", width: "30%", align: "left" as const },
        // { label: "Status", key: "status", width: "10%", align: "center" as const },
        // { label: "", key: "actions", width: "5%", align: "center" as const },
    ];

    const toggleExpandRow = (leadId: number) => {
        setExpandedRows((prev) =>
            prev.includes(leadId)
                ? prev.filter((id) => id !== leadId)
                : [...prev, leadId]
        );
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

        if (!inquiries.length) {
            return (
                <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        align="center"
                        sx={{ py: 4 }}
                    >
                        No inquiries available
                    </TableCell>
                </TableRow>
            );
        }

        return inquiries.map((lead, index) => (
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
                        {lead.firstName || ""} {lead.lastName}
                    </TableCell>

                    <TableCell>
                        {lead.email || "-"}
                    </TableCell>

                    <TableCell>
                        {lead.phone || ""}
                    </TableCell>
                    {/* 
                    <TableCell align="center">
                        <Box
                            onClick={() => {
                                setSelectedInquiry(lead);
                                setStatusModalOpen(true);
                            }}
                            sx={{
                                backgroundColor: lead.status || "#1976d2",
                                color: "#fff",
                                fontSize: "11px",
                                fontWeight: 600,
                                borderRadius: "20px",
                                px: 1.5,
                                py: 0.5,
                                minWidth: 80,
                                textAlign: "center",
                                display: "inline-block",
                                cursor: "pointer",
                            }}
                        >
                            {lead.status || "-"}
                        </Box>
                    </TableCell>

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
                    </TableCell> */}
                </TableRow>
            </React.Fragment>
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

            {/* <LeadStatusModal
                open={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                lead={selectedInquiry}
                onSuccess={() => {
                    window.location.reload(); // or call your API refetch function
                }}
            /> */}
        </>
    );
};

export default InquiriesTable;