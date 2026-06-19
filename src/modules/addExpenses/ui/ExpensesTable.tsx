"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Box, Dialog, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { ExpenseTableProps } from '../expenses.types';


const ExpensesTable: React.FC<ExpenseTableProps> = ({
    totalRows,
    expenses,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
}) => {
    const [openDocModal, setOpenDocModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

    const handleOpenDocument = (docPath: string) => {
        setSelectedDocument(docPath);
        setOpenDocModal(true);
    };

    const handleCloseDocument = () => {
        setOpenDocModal(false);
        setSelectedDocument(null);
    };

    const columns = [
        { label: "Date", key: "date", width: "15%", align: "left" as const },
        { label: "Expense Type", key: "expenseTypeInfo", width: "15%", align: "left" as const },
        { label: "Description", key: "smallDescription", width: "20%", align: "left" as const },
        { label: "Branch", key: "branchInfo", width: "20%", align: "left" as const },
        { label: "Amount (LKR)", key: "amount", width: "10%", align: "right" as const },
        { label: "Document", key: "documentPath", width: "20%", align: "center" as const },
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
                </TableRow>
            ));
        }

        if (!expenses.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return expenses.map((expense, index) => (
            <TableRow
                key={expense.id}
                sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}
            >
                <TableCell align="left">{expense.date}</TableCell>
                <TableCell align="left">{expense.expenseTypeInfo.title.EN}</TableCell>
                <TableCell align="left">{expense.smallDescription}</TableCell>
                <TableCell align="left">{expense.branchInfo?.title.EN ? expense.branchInfo?.title.EN : "_"}</TableCell>
                <TableCell align="right">{expense.amount.toLocaleString("en-US")}</TableCell>
                <TableCell align="center">
                    {expense.documentPath ? (
                        <Box
                            sx={{ cursor: "pointer", display: "inline-block" }}
                            onClick={() => handleOpenDocument(expense.documentPath!)}
                        >
                            {expense.documentPath.endsWith(".pdf") ? (
                                <Typography color="primary" sx={{ textDecoration: "underline" }}>
                                    View PDF
                                </Typography>
                            ) : (
                                <Image
                                    src={expense.documentPath}
                                    alt="Expense Document"
                                    width={60}
                                    height={60}
                                    style={{ objectFit: "cover", borderRadius: "5px" }}
                                />
                            )}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No Document
                        </Typography>
                    )}
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
                page={page - 1}
                onPageChange={(e, newPage) => { onPageChange(newPage) }}
                onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
            />

            <Dialog open={openDocModal} onClose={handleCloseDocument} maxWidth="md">
                <Box display="flex" justifyContent="flex-end" p={1}>
                    <IconButton onClick={handleCloseDocument}>
                        <CloseIcon sx={{ width: 15, height: 15 }} />
                    </IconButton>
                </Box>
                <Box
                    sx={{ p: 2, maxHeight: "600px", overflowY: "auto", width: "500px" }}
                >
                    {selectedDocument && selectedDocument.endsWith(".pdf") ? (
                        <Box sx={{ height: "80vh", width: "100%" }}>
                            <iframe
                                src={selectedDocument}
                                title="Document Preview"
                                width="100%"
                                height="100%"
                                style={{ border: "none" }}
                            />
                        </Box>
                    ) : (
                        selectedDocument && (
                            <Box display="flex" justifyContent="center">
                                <Image
                                    src={selectedDocument}
                                    alt="Document Preview"
                                    width={600}
                                    height={600}
                                    style={{
                                        objectFit: "contain",
                                        maxHeight: "80vh",
                                        borderRadius: "8px",
                                    }}
                                />
                            </Box>
                        )
                    )}
                </Box>
            </Dialog>
        </Box>
    );
};

export default ExpensesTable;