'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { Button, Box, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

import { coursePageInitialState, coursePageReducer, CoursePageStateType } from '@/modules/courses/courses.types';
import { getCoursesData } from '@/modules/courses/services/courses.service';
import CoursesTable from '@/modules/courses/ui/CoursesTable';
import AddCourseModal from '@/modules/courses/ui/AddCourseModal';
import { getCookieUser } from '@/utils/cookie.util';


const CoursesPage = () => {
    const theme = useTheme();

    const [state, dispatch] = useReducer(coursePageReducer, coursePageInitialState);
    const { courses, isLoading, page, limit, totalRows, search, isOpen, selectedCourse } = state;
    const user = getCookieUser()
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    const updateState = (value: Partial<CoursePageStateType>) => {
        dispatch({ type: 'update', payload: value });
    };

    const fetchCoursesData = useCallback(async (noLoading = false, paramPage = page, propSearch = false) => {
        try {
            if (!noLoading) {
                updateState({ isLoading: true });
            }
            const response = await getCoursesData(paramPage + 1, limit, propSearch ? "" : search);
            if (response?.success) {
                updateState({
                    courses: response.courses,
                    totalRows: response.totalCourses
                });
            }
        } catch (error) {
            console.log('Error fetching courses data:', error);
        } finally {
            updateState({ isLoading: false });
        }
    }, [page, limit, search]);


    useEffect(() => {
        fetchCoursesData(true);
    }, [limit]);

    const handlePageChange = (newPage: number) => {
        updateState({ page: newPage });
        fetchCoursesData(true, newPage);
    };

    const handleRowsPerPageChange = (rows: number) => {
        updateState({ limit: rows, page: 0 });
    };

    const handleSearch = async () => {
        updateState({ page: 0, limit: 5 });
        await fetchCoursesData(false, 0);
    };

    const handleClearSearch = async () => {
        updateState({ search: '', page: 0, limit: 5 });
        await fetchCoursesData(false, 0, true);
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
                {/* <PackageSearch
                    search={search}
                    setSearch={(value) => updateState({ search: value })}
                    loading={isLoading}
                    onSearch={handleSearch}
                    handleClearSearch={handleClearSearch}
                /> */}
                <Box
                    sx={{
                        width: '100%',
                        color: theme.palette.text.primary,
                        borderRadius: "5px",
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
                        <Typography variant="h6" color={theme.palette.text.primary}>
                            Courses
                        </Typography>
                        {
                            user && user.roll === 1 && (
                                <Box display="flex" justifyContent="flex-end">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => dispatch({ type: 'update', payload: { isOpen: true } })}
                                        color="primary"
                                        sx={{
                                            backgroundColor: "#1976d2",
                                            borderRadius: "5px",
                                            textTransform: "none",
                                            "&:hover": { backgroundColor: "#115293" },
                                            width: "160px"
                                        }}
                                    >
                                        <AddIcon sx={{ width: 20, height: 20 }} />
                                        Add Course
                                    </Button>
                                    <AddCourseModal
                                        isOpen={isOpen}
                                        onClose={() => dispatch({ type: 'update', payload: { isOpen: false } })}
                                        handleReload={fetchCoursesData}
                                    />
                                </Box>
                            )
                        }
                    </Box>
                    <CoursesTable
                        totalRows={totalRows}
                        courses={courses}
                        isLoading={isLoading}
                        page={page}
                        limit={limit}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        reloadData={() => fetchCoursesData(true, page)}
                        selectedCourse={selectedCourse}
                        setSelectedCourse={(staff) => updateState({ selectedCourse: staff })}
                    />
                </Box>
            </Box>
        </>
    )
}

export default CoursesPage