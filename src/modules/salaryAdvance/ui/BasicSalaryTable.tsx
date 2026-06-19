"use client";

import React, { useEffect, useState } from 'react';
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import EditBasicSalaryModal from './EditBasicSalaryModal';
import DeleteBasicSalaryModal from './DeleteBasicSalaryModal';
import { BasicSalaryDataType } from '../salaryAdvance.types';
import { getBasicSalaryData } from '../service/salaryAdvance.service';

import { TableProps } from '@/modules/attendanceMark/attendanceMarks.types';


const BasicSalaryTable: React.FC<TableProps> = ({ reload, handleReload }) => {
    const [basicSalaries, setBasicSalaries] = useState<BasicSalaryDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const limit = 5

    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedBasicSalary, setSelectedBasicSalary] = useState<BasicSalaryDataType | null>(null);

    const handleEditClick = (basicSalary: BasicSalaryDataType) => {
        const transformedData = {
            ...basicSalary,
            role: basicSalary.roll, 
        };

        setSelectedBasicSalary(transformedData);
        setOpenEditModal(true);
    };

    const handleDeleteClick = (basicSalary: BasicSalaryDataType) => {
        setSelectedBasicSalary(basicSalary);
        setOpenDeleteModal(true);
    };

    const fetchBasicSalaryData = async (noLoading?: boolean) => {
        try {
            if (!noLoading) setIsLoading(true);

            const response = await getBasicSalaryData();

            if (response?.success) {
                setBasicSalaries(response.data);
            }
        } catch (error) {
            console.log('Error fetching basic salary data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBasicSalaryData(true);
    }, [reload]);

    useEffect(() => {
        fetchBasicSalaryData(true);
    }, [limit]);

    return (
        <Box>
            {isLoading ? (
                <Typography variant="body1" align="center">
                    Loading...
                </Typography>
            ) : basicSalaries.length === 0 ? (
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
                                    <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px" }}>Role</TableCell>
                                    <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px" }}>Role Name</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "12px" }}>Basic Salary</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "12px" }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {basicSalaries.map((data) => (
                                    <React.Fragment key={data.roll}>
                                        <TableRow>
                                            <TableCell align="left">{data.roll}</TableCell>
                                            <TableCell align="left">{data.title}</TableCell>
                                            <TableCell align="right">{data.basicSalary.toLocaleString('en-US')}</TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => handleEditClick(data)} aria-label="edit">
                                                    <EditIcon color='primary' sx={{ width: "20px", height: "20px" }} />
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteClick(data)} aria-label="delete">
                                                    <DeleteIcon color='error' sx={{ width: "20px", height: "20px" }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
            {openEditModal && selectedBasicSalary && (
                <EditBasicSalaryModal
                    isOpen={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    initialValues={selectedBasicSalary}
                    reloadData={handleReload}
                />
            )}

            {openDeleteModal && selectedBasicSalary && (
                <DeleteBasicSalaryModal
                    isOpen={openDeleteModal}
                    onClose={() => setOpenDeleteModal(false)}
                    selectedData={selectedBasicSalary}
                    reloadData={handleReload}
                />
            )}

        </Box>
    );
};

export default BasicSalaryTable;
