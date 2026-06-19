"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';

import { CommissionDataType } from '../commissions.types';
import { getCommissionData } from '../service/commissions.service';

import { TableProps } from '@/modules/attendanceMark/attendanceMarks.types';
import { ROLES } from '@/constants/data';


const CommissionsTable: React.FC<TableProps> = ({ reload }) => {
    const [commissions, setCommissions] = useState<CommissionDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [totalRows, setTotalRows] = useState(0);

    const fetchCommissionData = async (noLoading?: boolean, paramPage?: number) => {
        try {
            if (!noLoading) setIsLoading(true);

            const response = await getCommissionData(paramPage || (page) + 1, limit);

            if (response?.success) {
                setCommissions(response.commissions);
                setTotalRows(response.totalCommission);
            }
        } catch (error) {
            console.log('Error fetching commission data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCommissionData();
    }, [reload]);

    useEffect(() => {
        fetchCommissionData(true);
    }, [limit]);

    const onPageChange = async (page_: number) => {
        setPage(page_)
        fetchCommissionData(true, page_ + 1);
    }

    const onRowsPerPageChange = async (rows: number) => {
        setLimit(rows);
        setPage(0);
    }

    const roleMap = useMemo(() => {
        return ROLES.reduce((map, role) => {
            map[role.id] = role.label;
            return map;
        }, {} as Record<number, string>);
    }, []);

    return (
        <Box>
            {isLoading ? (
                <Typography variant="body1" align="center">
                    Loading...
                </Typography>
            ) : commissions.length === 0 ? (
                <Typography variant="body1" align="center">
                    No data available
                </Typography>
            ) : (
                <>
                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{
                            overflowX: 'auto',
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                        }}
                    >
                        <Table
                            sx={{
                                minWidth: 700,
                                borderCollapse: 'collapse',
                                '& th': {
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                    borderBottom: '1px solid #ddd',
                                },
                                '& tr': {
                                    borderBottom: '1px solid #ccc',
                                },
                                '& tbody > tr:last-child': {
                                    borderBottom: 'none',
                                },
                                '& td': {
                                    fontSize: '13px',
                                },
                            }}
                            aria-label="universities table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px" }}>ID</TableCell>
                                    <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px" }}>Role</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "12px" }}>Amount</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {commissions.map((data) => (
                                    <React.Fragment key={data.id}>
                                        <TableRow>
                                            <TableCell align="left">{data.id}</TableCell>
                                            <TableCell align="left">{roleMap[data.role] || 'Unknown'}</TableCell>
                                            <TableCell align="right">{data.amount}</TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        component="div"
                        count={totalRows}
                        rowsPerPage={limit}
                        page={page}
                        onPageChange={(e, newPage) => { onPageChange(newPage) }}
                        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
                    />
                </>
            )}
        </Box>
    );
};

export default CommissionsTable;
