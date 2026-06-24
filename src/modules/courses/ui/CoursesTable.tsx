"use client";

import React, { useState } from 'react';
import { Box, Dialog, DialogContent, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import Course from './Course';
import { CourseDataType, CourseTableProps } from '../courses.types';
import EditCourseModal from './EditCourseModal';

import { getCookieUser } from '@/utils/cookie.util';
import { logActivity } from '@/utils/logActivity';


const CoursesTable: React.FC<CourseTableProps> = ({
    totalRows,
    courses,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
    selectedCourse,
    setSelectedCourse,
    reloadData
}) => {
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openPreviewModal, setOpenPreviewModal] = useState(false);
    const user = getCookieUser()

    const columns = [
        { label: "Course ID", key: "id", width: "10%", align: "center" as const },
        { label: "Title", key: "title", width: "30%", align: "left" as const },
        { label: "University", key: "universityInfo.name", width: "30%", align: "left" as const },
        { label: "Country", key: "country", width: "15%", align: "left" as const },
        { label: "", key: "actions", width: "5%", align: "center" as const },
        { label: "", key: "actions", width: "5%", align: "center" as const },
        { label: "", key: "actions", width: "5%", align: "center" as const },
    ];

    const toggleExpandRow = (courseId: number) => {
        setExpandedRows((prev) =>
            prev.includes(courseId)
                ? prev.filter((id) => id !== courseId)
                : [...prev, courseId]
        );

        logActivity({
            userId: user ? user.id : 0,
            action: "COURSE_ROW_EXPAND",
            path: "/modules/courses/ui/CoursesTable",
            method: "CLIENT",
            meta: {
                courseId
            }
        });
    };

    const handleEditClick = (course: CourseDataType) => {
        setSelectedCourse(course);
        setOpenEditModal(true);

        logActivity({
            userId: user ? user.id : 0,
            action: "EDIT_COURSE_CLICK",
            path: "/modules/courses/ui/CoursesTable",
            method: "CLIENT",
            meta: { courseID: course.id },
        });
    };

    const handlePreviewClick = (course: CourseDataType) => {
        setSelectedCourse(course);
        setOpenPreviewModal(true);

        logActivity({
            userId: user ? user.id : 0,
            action: "PREVIEW_COURSE_CLICK",
            path: "/modules/courses/ui/CoursesTable",
            method: "CLIENT",
            meta: { courseID: course.id },
        });
    };

    const expandedContent = (course: CourseDataType) => (
        <Box sx={{ p: 2 }}>
            <Box
                display="grid"
                gridTemplateColumns="repeat(2, 1fr)"
                gap={2}
            >
                <Box>
                    <Typography fontWeight={600}>
                        Course Information
                    </Typography>

                    <Typography variant="body2">
                        <strong>Level:</strong> {course.level}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Credits:</strong> {course.credits}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Duration:</strong> {course.duration}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Status:</strong>{" "}
                        {course.isActive ? "Active" : "Inactive"}
                    </Typography>
                </Box>

                <Box>
                    <Typography fontWeight={600}>
                        English Requirement
                    </Typography>

                    {course.englishRequirement?.map((req, index) => (
                        <Box
                            key={index}
                            sx={{
                                mb: 2,
                                p: 1,
                                border: "1px solid #eee",
                                borderRadius: 1,
                            }}
                        >
                            <Typography variant="body2">
                                <strong>Test:</strong> {req.test}
                            </Typography>

                            <Typography variant="body2">
                                <strong>Overall Score:</strong> {req.overallScore}
                            </Typography>

                            <Typography variant="body2">
                                <strong>Minimum Band:</strong> {req.minimumBand}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Box>
                    <Typography fontWeight={600}>
                        Fees
                    </Typography>

                    <Typography variant="body2">
                        <strong>Tuition Fee:</strong>{" "}
                        {course.tuitionFee
                            ? `$${course.tuitionFee.toLocaleString()}`
                            : "-"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Application Fee:</strong>{" "}
                        {course.applicationFee
                            ? `$${course.applicationFee.toLocaleString()}`
                            : "-"}
                    </Typography>
                </Box>

                <Box>
                    <Typography fontWeight={600}>
                        University
                    </Typography>

                    <Typography variant="body2">
                        <strong>Name:</strong>{" "}
                        {course.universityInfo?.name || "-"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Country:</strong>{" "}
                        {course.universityInfo?.countryInfo?.title?.EN || "-"}
                    </Typography>
                </Box>
            </Box>

            {course.specializations?.length > 0 && (
                <Box mt={2}>
                    <Typography fontWeight={600}>
                        Specializations
                    </Typography>

                    <Typography variant="body2">
                        {course.specializations.join(", ")}
                    </Typography>
                </Box>
            )}

            {course.intakes?.length > 0 && (
                <Box mt={2}>
                    <Typography fontWeight={600}>Intakes</Typography>

                    <Typography variant="body2">
                        {course.intakes.join(", ")}
                    </Typography>
                </Box>
            )}

            {course.entryRequirements?.length > 0 && (
                <Box mt={2}>
                    <Typography fontWeight={600}>
                        Entry Requirements
                    </Typography>

                    <ul style={{ marginTop: 5 }}>
                        {course.entryRequirements.map((item, index) => (
                            <li key={index}>
                                <Typography variant="body2">
                                    {item}
                                </Typography>
                            </li>
                        ))}
                    </ul>
                </Box>
            )}

            {course.careerOpportunities?.length > 0 && (
                <Box mt={2}>
                    <Typography fontWeight={600}>
                        Career Opportunities
                    </Typography>

                    <Typography variant="body2">
                        {course.careerOpportunities.join(", ")}
                    </Typography>
                </Box>
            )}

            {course.features?.length > 0 && (
                <Box mt={2}>
                    <Typography fontWeight={600}>
                        Features
                    </Typography>

                    <Typography variant="body2">
                        {course.features.join(", ")}
                    </Typography>
                </Box>
            )}

            {course.description && (
                <Box mt={2}>
                    <Typography fontWeight={600}>
                        Description
                    </Typography>

                    <Typography variant="body2">
                        {course.description}
                    </Typography>
                </Box>
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
                </TableRow>
            ));
        }

        if (!courses.length) {
            return (
                <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        align="center"
                        sx={{ py: 4 }}
                    >
                        No courses available
                    </TableCell>
                </TableRow>
            );
        }

        return courses.map((course, index) => (
            <React.Fragment key={course.id}>
                <TableRow
                    sx={{
                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    }}
                >
                    <TableCell align="center">{course.id}</TableCell>

                    <TableCell align="left">
                        <Box>
                            <Typography fontSize={12} fontWeight={600}>
                                {course.title}
                            </Typography>

                            {course.shortCode && (
                                <Typography fontSize={11} color="text.secondary">
                                    {course.shortCode}
                                </Typography>
                            )}
                        </Box>
                    </TableCell>

                    <TableCell align="left">
                        {course.universityInfo?.name}
                    </TableCell>

                    <TableCell align="left">
                        {course.universityInfo?.countryInfo?.title?.EN ||
                            course.universityInfo?.countryInfo?.title.EN ||
                            "-"}
                    </TableCell>

                    <TableCell>
                        {user && user.roll === 1 && (
                            <IconButton onClick={() => handleEditClick(course)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        )}
                    </TableCell>
                    <TableCell align="right">
                        <IconButton onClick={() => handlePreviewClick(course)}>
                            <RemoveRedEyeIcon fontSize="small" />
                        </IconButton>
                    </TableCell>
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            onClick={() => toggleExpandRow(course.id)}
                        >
                            <ExpandMoreIcon
                                sx={{
                                    transition: "0.3s",
                                    transform: expandedRows.includes(course.id)
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                }}
                            />
                        </IconButton>
                    </TableCell>
                </TableRow>

                {expandedRows.includes(course.id) && (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            sx={{
                                backgroundColor: "#f8fafc",
                                p: 0,
                            }}
                        >
                            {expandedContent(course)}
                        </TableCell>
                    </TableRow>
                )}
            </React.Fragment>
        ));
    };

    return (
        <>
            <Box>
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ maxHeight: 370, overflowY: "auto", borderRadius: "5px" }}
                >
                    <Table
                        stickyHeader
                        sx={{
                            minWidth: 700,
                            borderCollapse: "collapse",
                            "& th": {
                                fontWeight: "bold",
                                fontSize: 12,
                                borderBottom: "1px solid #ddd",
                                py: 1,
                                backgroundColor: "#fff",
                            },
                            "& td": { fontSize: 12, py: 1 },
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

            {openEditModal && selectedCourse && (
                <EditCourseModal
                    isOpen={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    initialValues={selectedCourse}
                    reloadData={reloadData}
                />
            )}

            <Dialog
                open={openPreviewModal}
                onClose={() => setOpenPreviewModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    {selectedCourse && (
                        <Course
                            course={selectedCourse}
                            setIsModalOpen={setOpenPreviewModal}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CoursesTable;
