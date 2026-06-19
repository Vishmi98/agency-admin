"use client";

import React, { useState } from 'react';
import { Box, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { PackageDataType, PackageTableProps } from '../package.types';

import { getCookieUser } from '@/utils/cookie.util';


const PackagesTable: React.FC<PackageTableProps> = ({
    totalRows,
    packages,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
}) => {
    const user = getCookieUser();
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const columns = [
        { label: "Package ID", key: "id", width: "10%", align: "center" as const },
        { label: "Title", key: "title", width: "25%", align: "left" as const },
        { label: "Course Name", key: "courseName", width: "25%", align: "left" as const },
        { label: "Start Date", key: "startDate", width: "15%", align: "left" as const },
        { label: "Price (USD)", key: "price", width: "10%", align: "right" as const },
        { label: "Cost (USD)", key: "cost", width: "10%", align: "right" as const },
    ];

    const toggleExpandRow = (packageId: number) => {
        setExpandedRows((prev) =>
            prev.includes(packageId)
                ? prev.filter((id) => id !== packageId)
                : [...prev, packageId]
        );
    };

    const expandedContent = (pack: PackageDataType) => (
        <Box sx={{ p: 2 }}>
            <Typography variant="body2"><strong>University name:</strong> {pack.uniInfo?.name}</Typography>
            <Typography variant="body2"><strong>Country:</strong> {pack.countryInfo?.title["EN"]}</Typography>
            <Typography variant="body2"><strong>Entry Qualification:</strong> {pack.entryQualificationInfo.title.EN}</Typography>
            <Typography variant="body2"><strong>Qualification:</strong> {pack.qualificationInfo.title.EN}</Typography>
            <Typography variant="body2"><strong>Study type:</strong> {pack.studyTypeInfo?.title.EN}</Typography>
            {user && typeof user !== "string" && user.roll === 5 && (
                <>
                    <Typography variant="body2"><strong>Cost:</strong> LKR {pack.costInLkr.toLocaleString("en-US")}</Typography>
                    <Typography variant="body2"><strong>Price:</strong> LKR {pack.priceInLkr.toLocaleString("en-US")}</Typography>
                </>
            )}
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
                    <TableCell align="right">
                        <Skeleton variant="circular" width={24} height={24} />
                    </TableCell>
                </TableRow>
            ));
        }

        if (!packages.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return packages.map((pack, index) => (
            <React.Fragment key={pack.id}>
                <TableRow
                    sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
                >
                    {columns.map((col) => (
                        <TableCell key={col.key} align={col.align}>
                            {(() => {
                                const value = pack[col.key as keyof PackageDataType];
                                if (!value) return "";
                                if (typeof value === "object" && "title" in value && value.title.EN) {
                                    return value.title.EN;
                                }
                                if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                                    return value.toString();
                                }
                                return "";
                            })()}                        </TableCell>
                    ))}
                    <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
                        <IconButton onClick={() => toggleExpandRow(pack.id)}>
                            <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                    </TableCell>
                </TableRow>

                {expandedRows.includes(pack.id) && (
                    <TableRow>
                        <TableCell colSpan={columns.length + 1} sx={{ backgroundColor: "#f1f1f1" }}>
                            {expandedContent(pack)}
                        </TableCell>
                    </TableRow>
                )}
            </React.Fragment>
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
                                        width: col.width
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
                onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
            />
        </Box>
    );
};

export default PackagesTable;
