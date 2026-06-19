"use client";

import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { toast } from 'react-toastify';

import PaySheet from './PaySheet';
import { SalariesTableProps, SalaryDataType } from '../salaryAdvance.types';
import { getSalariesByMonth, paySalary } from '../service/salaryAdvance.service';


const columns = [
    { label: "Staff ID", key: "staffId", width: "10%", align: "center" as const },
    { label: "Name", key: "fullName", width: "30%", align: "left" as const },
    { label: "Month", key: "month", width: "10%", align: "left" as const },
    { label: "Gross Salary (LKR)", key: "grossSalary", width: "20%", align: "right" as const },
    { label: "Net Salary (LKR)", key: "netSalary", width: "20%", align: "right" as const },
];

const SearchSalariesTable: React.FC<SalariesTableProps> = ({ month }) => {
    const theme = useTheme();

    const [salaries, setSalaries] = useState<SalaryDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSalary, setSelectedSalary] = useState<SalaryDataType | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [salaryToPay, setSalaryToPay] = useState<SalaryDataType | null>(null);

    const handlePreviewClick = (salary: SalaryDataType) => {
        setSelectedSalary(salary);
        setIsModalOpen(true);
    };

    const handlePaidClick = (salary: SalaryDataType) => {
        setSalaryToPay(salary);
        setIsConfirmModalOpen(true);
    };

    const fetchSalaries = async (noLoading?: boolean, paramPage?: number) => {
        try {
            if (!noLoading) setIsLoading(true);

            const response = await getSalariesByMonth(paramPage || (page) + 1, rowsPerPage, month);

            if (response?.success) {
                setSalaries(response.salaries);
                setTotalRows(response.totalSalaries);
            } else {
                setSalaries([])
            }
        } catch (error) {
            setSalaries([])
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmPaid = async () => {
        if (!salaryToPay) return;

        try {
            const res = await paySalary(salaryToPay.staffId, month);
            if (res.success) {
                toast.success(res.message)
                await fetchSalaries();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.log("Error paying salary:", error);
            toast.error("Error paying salary.");
        } finally {
            setIsConfirmModalOpen(false);
            setSalaryToPay(null);
        }
    };

    useEffect(() => {
        fetchSalaries();
    }, [month]);

    useEffect(() => {
        fetchSalaries(true);
    }, [rowsPerPage]);

    const onPageChange = async (page_: number) => {
        setPage(page_)
        fetchSalaries(true, page_ + 1);
    }

    const onRowsPerPageChange = async (rows: number) => {
        setRowsPerPage(rows);
        setPage(0);
    }

    const renderRows = () => {
        if (isLoading) {
            return Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    {columns.map(col => (
                        <TableCell key={col.key} align={col.align}>
                            <Skeleton variant="text" />
                        </TableCell>
                    ))}
                    <TableCell align="center"><Skeleton variant="text" /></TableCell>
                    <TableCell align="center"><Skeleton variant="text" /></TableCell>
                </TableRow>
            ));
        }

        if (!salaries.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length + 2} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return salaries.map((salary, index) => (
            <TableRow key={salary.id} sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
                <TableCell align="center">{salary.staffId}</TableCell>
                <TableCell align="left">{salary.staffInfo?.fullName}</TableCell>
                <TableCell align="left">{salary.monthInfo.month}</TableCell>
                <TableCell align="right">{salary.grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell align="right">{salary.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell align="center">
                    <RemoveRedEyeIcon sx={{ fontSize: 20, cursor: "pointer" }} onClick={() => handlePreviewClick(salary)} />
                </TableCell>
                <TableCell align="center">
                    <Button
                        size="small"
                        variant="contained"
                        disabled={salary.isPaid}
                        onClick={() => handlePaidClick(salary)}
                    >
                        {salary.isPaid ? "Paid" : "Pay"}
                    </Button>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <Box>
            <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 370, overflowY: "auto", borderRadius: "5px" }}>
                <Table stickyHeader sx={{ minWidth: 700, borderCollapse: "collapse", "& th": { fontWeight: "bold", fontSize: "12px", borderBottom: "1px solid #ddd", py: 1 }, "& td": { fontSize: "12px", py: 1 } }}>
                    <TableHead>
                        <TableRow>
                            {columns.map(col => (
                                <TableCell key={col.key} align={col.align} sx={{ fontWeight: "bold", fontSize: 12, backgroundColor: "#fff", borderBottom: "1px solid #ddd", width: col.width }}>
                                    {col.label}
                                </TableCell>
                            ))}
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: 12, backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}></TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: 12, backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderRows()}</TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => onPageChange(newPage)}
                onRowsPerPageChange={e => onRowsPerPageChange(parseInt(e.target.value))}
            />

            {/* Preview Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="lg" fullWidth>
                <DialogContent>
                    {selectedSalary && <PaySheet salary={selectedSalary} setIsModalOpen={setIsModalOpen} />}
                </DialogContent>
            </Dialog>

            {/* Confirm Paid Modal */}
            <Dialog open={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} fullWidth maxWidth="xs"
                PaperProps={{ style: { borderRadius: 10, boxShadow: "0px 4px 20px rgba(0,0,0,0.1)", backgroundColor: theme.palette.background.paper } }}
            >
                <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Paid Salary</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to pay salary for this staff member?</Typography>
                </DialogContent>
                <DialogActions sx={{ gap: 1 }}>
                    <Button variant="outlined" onClick={() => setIsConfirmModalOpen(false)} sx={{ width: 120 }}>No</Button>
                    <Button variant="contained" onClick={handleConfirmPaid} sx={{ width: 120 }}>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SearchSalariesTable;
