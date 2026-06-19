"use client";

import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';


const SalariesTable = () => {
    return (
        <Box>
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
                            <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px" }}>Staff ID</TableCell>
                            <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px" }}>Full Name</TableCell>
                            <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px" }}>Date</TableCell>
                            <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "12px" }}>Salary</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
        
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SalariesTable;
