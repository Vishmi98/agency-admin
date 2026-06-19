"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Box, Card, Dialog, DialogContent, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Student from './Student';
import EditStudentModal from './EditStudentModal';
import { StudentDataType, StudentTableProps } from '../student.types';


const StudentsTable: React.FC<StudentTableProps> = ({
    totalRows,
    students,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
    selectedStudent,
    setSelectedStudent,
    reloadData
}) => {
    const [openPreviewModal, setOpenPreviewModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const handlePreviewClick = (student: StudentDataType) => {
        setSelectedStudent(student);
        setOpenPreviewModal(true);
    };

    const handleEditClick = (student: StudentDataType) => {
        setSelectedStudent(student);
        setOpenEditModal(true);
    };

    const toggleExpandRow = (studentId: number) => {
        setExpandedRows((prev) =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const columns = [
        { label: "ID", key: "id", width: "10%", align: "center" as const },
        { label: "Student Name", key: "fullName", width: "30%", align: "left" as const },
        { label: "Email", key: "email", width: "25%", align: "left" as const },
        { label: "Phone Number", key: "phone", width: "15%", align: "left" as const },
        { label: "NIC", key: "nic", width: "20%", align: "left" as const },
    ];

    const expandedContent = (student: StudentDataType) => (
        <>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
                Passport Details:
            </Typography>
            <Card className="w-full max-w-lg md:mx-auto border bg-gray-100 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row p-4">
                    <div className="w-full md:w-1/3 flex justify-center items-center mb-4 md:mb-0">
                        <Image
                            src="/avatar.png"
                            alt="Passport Avatar"
                            width={130}
                            height={130}
                            className="rounded-md border"
                        />
                    </div>
                    <div className="w-full md:w-2/3 md:pl-2">
                        <Typography variant="body1"><strong>Full Name:</strong> {student.fullName}</Typography>
                        <Typography variant="body1"><strong>Passport No:</strong> {student.passportNo}</Typography>
                        <Typography variant="body1"><strong>Date of Issue:</strong> {student.issueDate}</Typography>
                        <Typography variant="body1"><strong>Date of Expiry:</strong> {student.expireDate}</Typography>
                        <Typography variant="body1"><strong>Student Status:</strong> {student.statusInfo?.title?.EN || ""}</Typography>
                        <Typography variant="body1"><strong>Visa Status:</strong> {student?.visaStatusInfo?.title?.EN || ""}</Typography>
                    </div>
                </div>
            </Card>
        </>
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
                    <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="circular" width={24} height={24} />
                    </TableCell>
                </TableRow>
            ));
        }

        if (!students.length) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return students.map((student: StudentDataType, index: number) => (
            <React.Fragment key={student.id}>
                <TableRow
                    sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
                >
                    {columns.map((col) => (
                        <TableCell key={col.key} align={col.align}>
                            {student[col.key as keyof StudentDataType] as string | number}
                        </TableCell>
                    ))}
                    <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
                        <IconButton onClick={() => handleEditClick(student)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handlePreviewClick(student)}>
                            <RemoveRedEyeIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => toggleExpandRow(student.id)}>
                            <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                    </TableCell>
                </TableRow>

                {expandedRows.includes(student.id) && (
                    <TableRow>
                        <TableCell colSpan={columns.length + 1} sx={{ backgroundColor: "#f1f1f1" }}>
                            {expandedContent(student)}
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

            {/* Edit Modal */}
            {openEditModal && selectedStudent && (
                <EditStudentModal
                    isOpen={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    initialValues={selectedStudent}
                    reloadData={reloadData}
                />
            )}

            {/* Preview Modal */}
            <Dialog open={openPreviewModal} onClose={() => setOpenPreviewModal(false)} maxWidth="md" fullWidth>
                <DialogContent>
                    {selectedStudent && <Student student={selectedStudent} setIsModalOpen={setOpenPreviewModal} />}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default StudentsTable;