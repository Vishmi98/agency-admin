'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';

import StudentsTable from '@/modules/student/ui/StudentsTable';
import { getStudentData } from '@/modules/student/services/student.services';
import StudentSearch from '@/modules/student/ui/StudentSearch';
import { studentPageInitialState, studentPageReducer, StudentPageStateType } from '@/modules/student/student.types';
import { getCookieUser } from '@/utils/cookie.util';


const StudentPage = () => {
    const theme = useTheme();

    const [state, dispatch] = useReducer(studentPageReducer, studentPageInitialState);
    const { students, isLoading, selectedStudent, page, limit, totalRows, search } = state;
    const user = getCookieUser()
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    const updateState = (value: Partial<StudentPageStateType>) => {
        dispatch({ type: 'update', payload: value });
    };

    const fetchStudentData = useCallback(async (noLoading = false, paramPage = page, propSearch = false) => {
        try {
            if (!noLoading) {
                updateState({ isLoading: true });
            }
            const response = await getStudentData(paramPage + 1, limit, propSearch ? "" : search);
            if (response?.success) {
                updateState({ students: response.students, totalRows: response.totalStudents });
            }
        } catch (error) {
            console.log("Students table fetchStudentData error:", error);
        } finally {
            updateState({ isLoading: false });
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchStudentData(true);
    }, [limit]);

    const handlePageChange = (newPage: number) => {
        updateState({ page: newPage });
        fetchStudentData(true, newPage);
    };

    const handleRowsPerPageChange = (rows: number) => {
        updateState({ limit: rows, page: 0 });
    };

    const handleSearch = async () => {
        updateState({ page: 0, limit: 5 });
        await fetchStudentData(false, 0);
    };

    const handleClearSearch = async () => {
        updateState({ search: '', page: 0, limit: 5 });
        await fetchStudentData(false, 0, true);
    };

    return (
        <>
            <Box sx={{
                width: {
                    xs: 'auto',
                    md: '100%',
                },
                height: '100%',
                overflowX: { xs: 'scroll', md: 'hidden' },
                display: "flex",
                flexDirection: "column",
                gap: 1,
                marginTop: { xs: 1, lg: 0 }
            }}>
                <StudentSearch
                    search={search}
                    setSearch={(value) => updateState({ search: value })}
                    loading={isLoading}
                    onSearch={handleSearch}
                    handleClearSearch={handleClearSearch}
                />
                <Box marginY={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
                        <Typography variant="h6" color={theme.palette.text.primary}>
                            Students
                        </Typography>
                    </Box>
                    <StudentsTable
                        totalRows={totalRows}
                        students={students}
                        isLoading={isLoading}
                        page={page}
                        limit={limit}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        selectedStudent={selectedStudent}
                        reloadData={() => fetchStudentData(true)}
                        setSelectedStudent={(student) => updateState({ selectedStudent: student })}
                    />
                </Box>
            </Box>
        </>
    )
}

export default StudentPage