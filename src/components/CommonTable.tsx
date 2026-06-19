"use client"

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Paper,
    IconButton,
    Collapse,
    Box,
    Typography,
    TablePagination,
    Button,
    Skeleton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import { CommonTableProps } from '@/type/common.types';


const CommonTable = <T extends unknown>({
    totalRows,//CHECK
    data,
    columns,
    expandedContent,
    loading,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    showPreviewButton = false,
    handlePreview,
    showEditButton,
    handleEdit,
    showUpdateButton,
    handleUpdate
}: CommonTableProps<T>) => {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const handleExpandClick = (index: number) => {
        setExpandedRow(expandedRow === index ? null : index);
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
                    border: "1px solid #ddd",
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
                            backgroundColor: "#fff",
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
                                    align={col.align || "left"}
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                        borderBottom: "1px solid #ddd",
                                    }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                            <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "12px" }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            // ✅ Skeleton rows while loading
                            Array.from({ length: 5 }).map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {columns.map((col, colIndex) => (
                                        <TableCell key={colIndex} align={col.align || "left"}>
                                            <Skeleton variant="text" width="80%" height={20} />
                                        </TableCell>
                                    ))}
                                    <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
                                        <Skeleton variant="circular" width={24} height={24} />
                                        <Skeleton variant="circular" width={24} height={24} />
                                        <Skeleton variant="circular" width={24} height={24} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : data?.length > 0 ? (
                            data.map((row, index) => (
                                <React.Fragment key={index}>
                                    <TableRow
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                                        }}
                                    >
                                        {columns.map((col) => (
                                            <TableCell key={col.key} align={col.align || "left"}>
                                                {col.isCustom
                                                    ? (row as any).visaStatusInfo?.title?.EN
                                                    : (row[col.key as keyof T] as React.ReactNode)}
                                            </TableCell>
                                        ))}
                                        <TableCell align="right" width="20%">
                                            {showEditButton && (
                                                <IconButton onClick={() => handleEdit?.(row as T)} aria-label="edit">
                                                    <EditIcon sx={{ width: 20, height: 20 }} />
                                                </IconButton>
                                            )}
                                            {showPreviewButton && (
                                                <IconButton onClick={() => handlePreview?.(row as T)} aria-label="preview">
                                                    <RemoveRedEyeIcon sx={{ width: 20, height: 20 }} />
                                                </IconButton>
                                            )}
                                            {showUpdateButton && (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleUpdate?.(row as T)}
                                                    aria-label="update"
                                                >
                                                    <Typography fontSize={10} fontWeight={600}>
                                                        Update
                                                    </Typography>
                                                </Button>
                                            )}
                                            <IconButton
                                                aria-label="expand more"
                                                onClick={() => handleExpandClick(index)}
                                                aria-expanded={expandedRow === index}
                                            >
                                                <ExpandMoreIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    {expandedRow === index && expandedContent && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length + 1} sx={{ p: 0 }}>
                                                <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                                                    <Box m={2} sx={{ bgcolor: "#edeef0", p: 1, borderRadius: 2 }}>
                                                        {expandedContent(row)}
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} align="center">
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => { onPageChange(newPage) }}//CHECK
                onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}//CHECK
            />
        </Box>
    );
};

export default CommonTable;

