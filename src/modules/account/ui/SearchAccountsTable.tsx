"use client";

import React, { useEffect, useState } from "react";
import { Box, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { AccountsDataType, AccountsTableProps } from "../account.types";
import { getAccountsByMonth } from "../service/account.service";

import { TableColumnType } from "@/type/common.types";


const columns: TableColumnType[] = [
    { label: "Type", width: "15%", align: "left" },
    { label: "Description", width: "50%", align: "left" },
    { label: "Date", width: "15%", align: "left" },
    { label: "Amount (LKR)", width: "20%", align: "right" }
];


const SearchAccountsTable: React.FC<AccountsTableProps> = ({ month, onTotalsChange }) => {
    const [accounts, setAccounts] = useState<AccountsDataType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAccounts = async (noLoading?: boolean) => {
        try {
            if (!noLoading) setIsLoading(true);
            const response = await getAccountsByMonth(month);

            if (response?.success) {
                setAccounts(response.accounts);
                onTotalsChange?.({
                    totalIncome: response.totalIncome,
                    totalExpenses: response.totalExpenses,
                    profit: response.profit,
                });
            } else {
                setAccounts([]);
                onTotalsChange?.({ totalIncome: 0, totalExpenses: 0, profit: 0 });
            }
        } catch {
            setAccounts([]);
            onTotalsChange?.({ totalIncome: 0, totalExpenses: 0, profit: 0 });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchAccounts(); }, [month]);
    useEffect(() => { fetchAccounts(true); }, []);

    const renderRows = () => {
        if (isLoading) {
            return Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                    {columns.map((col) => (
                        <TableCell key={col.label} sx={{ width: col.width }}>
                            <Skeleton variant="text" />
                        </TableCell>
                    ))}
                </TableRow>
            ));
        }

        if (!accounts.length) {
            return (
                <TableRow>
                    <TableCell colSpan={4} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return accounts.map((account) => (
            <TableRow
                key={account.id}
                sx={{
                    backgroundColor:
                        account.type === "expense" || account.type === "salary"
                            ? "#f2f2f2"
                            : "#cae8d2",
                }}
            >
                <TableCell>{account.type.charAt(0).toUpperCase() + account.type.slice(1)}</TableCell>
                <TableCell>{account.description}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{account.date}</TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {(account.type === "expense" || account.type === "salary"
                        ? `-(${account.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
                        : account.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    )}
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <Box>
            <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 370, overflowY: "auto", borderRadius: "5px", }}>
                <Table stickyHeader sx={{ minWidth: 700, borderCollapse: "collapse", "& th": { fontWeight: "bold", fontSize: "12px", borderBottom: "1px solid #ddd", py: 1 }, "& td": { fontSize: "12px", py: 1 } }}>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.label}
                                    align={col.align || "left"}
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                        backgroundColor: "#fff",
                                        top: 0,
                                        zIndex: 2,
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
        </Box>
    );
};

export default SearchAccountsTable;
