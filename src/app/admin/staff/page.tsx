'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

import StaffTable from '@/modules/staff/ui/StaffTable';
import StaffSearch from '@/modules/staff/ui/StaffSearch';
import { staffPageInitialState, staffPageReducer, StaffPageStateType } from '@/modules/staff/staff.types';
import { getStaffData } from '@/modules/staff/services/staff.services';
import AddStaffModal from '@/modules/staff/ui/AddStaffModal';
import { getCookieUser } from '@/utils/cookie.util';
import { logActivity } from '@/utils/logActivity';


const StaffPage = () => {
    const theme = useTheme();

    const [state, dispatch] = useReducer(staffPageReducer, staffPageInitialState);
    const { staffs, isLoading, page, selectedStaff, limit, totalRows, search, isOpen } = state;
    const user = useMemo(() => getCookieUser(), []);
    const didFetch = useRef(false);
    const router = useRouter();

    const updateState = (value: Partial<StaffPageStateType>) => {
        dispatch({ type: 'update', payload: value });
    };

    const fetchStaffData = useCallback(async (noLoading = false, paramPage = page, propSearch = false) => {
        try {
            if (!noLoading) {
                updateState({ isLoading: true });
            }
            const response = await getStaffData(paramPage + 1, limit, propSearch ? "" : search);
            if (response?.success) {
                updateState({ staffs: response.staffs, totalRows: response.totalStaffs });
            }
        } catch (error) {
            console.log("Staffs table fetchStaffData error:", error);
        } finally {
            updateState({ isLoading: false });
        }
    }, [page, limit, search]);

    useEffect(() => {
        if (!user) {
            router.push('/');
            return;
        }

        if (didFetch.current) return;
        didFetch.current = true;

        fetchStaffData(true);

        // ✅ activity log ONLY ONCE
        logActivity({
            userId: user.id,
            action: "STAFFS_PAGE_VIEW",
            path: "/app/admin/staffs",
            method: "CLIENT",
        });

    }, []);

    const handlePageChange = (newPage: number) => {
        updateState({ page: newPage });
        fetchStaffData(true, newPage);

        if (user) {
            logActivity({
                userId: user.id,
                action: "STAFFS_PAGE_CHANGE",
                path: "/app/admin/staffs",
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
                action: "STAFFS_LIMIT_CHANGE",
                path: "/app/admin/staffs",
                method: "CLIENT",
                meta: {
                    limit: rows
                }
            });
        }
    };

    const handleSearch = async () => {
        updateState({ page: 0, limit: 5 });
        await fetchStaffData(false, 0);

        if (user) {
            logActivity({
                userId: user.id,
                action: "STAFFS_SEARCH",
                path: "/app/admin/staffs",
                method: "CLIENT",
                meta: {
                    search: search // add this
                }
            });
        }
    };

    const handleClearSearch = async () => {
        updateState({ search: '', page: 0, limit: 5 });
        await fetchStaffData(false, 0, true);

        if (user) {
            logActivity({
                userId: user.id,
                action: "STAFFS_CLEAR_SEARCH",
                path: "/app/admin/staffs",
                method: "CLIENT"
            });
        }
    };

    const handleAddStaffClick = () => {
        dispatch({ type: 'update', payload: { isOpen: true } });

        if (user) {
            logActivity({
                userId: user.id,
                action: "ADD_STAFF_BUTTON_CLICK",
                path: "/app/admin/staff",
                method: "CLIENT",
                meta: {
                    source: "StaffsPageHeaderButton"
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
                <StaffSearch
                    search={search}
                    setSearch={(value) => updateState({ search: value })}
                    loading={isLoading}
                    onSearch={handleSearch}
                    handleClearSearch={handleClearSearch}
                />
                <Box
                    sx={{
                        width: '100%',
                        color: theme.palette.text.primary,
                        borderRadius: "5px",
                        marginTop: 3
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
                        <Typography variant="h6" color={theme.palette.text.primary}>
                            Staff
                        </Typography>
                        {
                            user && user.roll === 1 && (
                                <Box display="flex" justifyContent="flex-end">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleAddStaffClick}
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
                                        Add Staff
                                    </Button>
                                    <AddStaffModal
                                        isOpen={isOpen}
                                        onClose={() => dispatch({ type: 'update', payload: { isOpen: false } })}
                                        handleReload={fetchStaffData}
                                    />
                                </Box>
                            )
                        }
                    </Box>
                    <StaffTable
                        totalRows={totalRows}
                        staffs={staffs}
                        isLoading={isLoading}
                        page={page}
                        limit={limit}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        reloadData={() => fetchStaffData(true)}
                        selectedStaff={selectedStaff}
                        setSelectedStaff={(staff) => updateState({ selectedStaff: staff })}
                    />
                </Box>
            </Box>
        </>
    );
};

export default StaffPage;
