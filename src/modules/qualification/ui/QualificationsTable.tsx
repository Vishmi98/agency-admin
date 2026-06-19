"use client";

import React, { useEffect, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import { getQualificationData } from '../services/qualification.services';

import { DropdownType } from '@/type/common.types';
import { TableProps } from '@/modules/countries/countries.types';

const QualificationsTable: React.FC<TableProps> = ({ reload }) => {
    const [qualifications, setQualifications] = useState<DropdownType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchQualificationData = async () => {
        setIsLoading(true);
        try {
            const response = await getQualificationData();
            if (response?.success) {
                setQualifications(response.qualifications);
            } else {
                setQualifications([]);
            }
        } catch (error) {
            setQualifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQualificationData();
    }, [reload]);

    return (
        <Box>
            {isLoading ? (
                <Typography data-testid='loading' variant="body1" align="center">
                    Loading...
                </Typography>
            ) : qualifications.length === 0 ? (
                <Typography data-testid='no-data' variant="body1" align="center">
                    No data available
                </Typography>
            ) : (
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
                        aria-label="qualifications table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "12px" }}>ID</TableCell>
                                <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px" }}>Qualification</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {qualifications.map((qualification) => (
                                <TableRow key={qualification.id}>
                                    <TableCell align="center">{qualification.id}</TableCell>
                                    <TableCell align="left" sx={{ textTransform: "capitalize" }}>{qualification.title.EN}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default QualificationsTable;
