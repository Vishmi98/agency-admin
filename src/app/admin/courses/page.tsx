'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { Button, Box, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

import { coursePageInitialState, coursePageReducer, CoursePageStateType } from '@/modules/courses/courses.types';
import { getCoursesData } from '@/modules/courses/services/courses.service';
import CoursesTable from '@/modules/courses/ui/CoursesTable';
import AddCourseModal from '@/modules/courses/ui/AddCourseModal';
import { getCookieUser } from '@/utils/cookie.util';
import { logActivity } from '@/utils/logActivity';


const CoursesPage = () => {
    const theme = useTheme();

    const [state, dispatch] = useReducer(coursePageReducer, coursePageInitialState);
    const { courses, isLoading, page, limit, totalRows, search, isOpen, selectedCourse } = state;
    const user = useMemo(() => getCookieUser(), []);
    const didFetch = useRef(false);
    const router = useRouter();

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
        fetchCoursesData();
    }, [page, limit, search]);

    useEffect(() => {
        if (!user) {
            router.push('/');
            return;
        }

        if (didFetch.current) return;
        didFetch.current = true;

        fetchCoursesData(true);

        // ✅ activity log ONLY ONCE
        logActivity({
            userId: user.id,
            action: "COURSES_PAGE_VIEW",
            path: "/app/admin/courses",
            method: "CLIENT",
        });

    }, []);

    const handlePageChange = (newPage: number) => {
        updateState({ page: newPage });
        fetchCoursesData(true, newPage);

        if (user) {
            logActivity({
                userId: user.id,
                action: "COURSES_PAGE_CHANGE",
                path: "/app/admin/courses",
                method: "CLIENT",
                meta: {
                    page: newPage
                }
            });
        }
    };

    const handleRowsPerPageChange = (rows: number) => {
        updateState({ limit: rows, page: 0 });

        if (user) {
            logActivity({
                userId: user.id,
                action: "COURSES_LIMIT_CHANGE",
                path: "/app/admin/courses",
                method: "CLIENT",
                meta: {
                    limit: rows
                }
            });
        }
    };

    const handleAddCourseClick = () => {
        dispatch({ type: 'update', payload: { isOpen: true } });

        if (user) {
            logActivity({
                userId: user.id,
                action: "ADD_COURSE_BUTTON_CLICK",
                path: "/app/admin/courses",
                method: "CLIENT",
                meta: {
                    source: "CoursesPageHeaderButton"
                }
            });
        }
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
                                        onClick={handleAddCourseClick}
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
                        reloadData={() => fetchCoursesData(true)}
                        selectedCourse={selectedCourse}
                        setSelectedCourse={(course) => updateState({ selectedCourse: course })}
                    />
                </Box>
            </Box>
        </>
    )
}

export default CoursesPage