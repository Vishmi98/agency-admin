'use client';

import { useCallback, useEffect, useReducer, useMemo, useRef } from 'react';
import { Button, Box, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

import { leadPageInitialState, leadPageReducer, LeadPageStateType } from '@/modules/leads/leads.types';
import { getLeadsData } from '@/modules/leads/leads.service';
import LeadsTable from '@/modules/leads/ui/LeadsTable';
import AddLeadModal from '@/modules/leads/ui/AddLeadModal';
import { getCookieUser } from '@/utils/cookie.util';
import { logActivity } from '@/utils/logActivity';

const LeadsPage = () => {
    const theme = useTheme();
    const router = useRouter();

    const [state, dispatch] = useReducer(leadPageReducer, leadPageInitialState);
    const { leads, isLoading, page, limit, totalRows, search, isOpen } = state;
    const user = useMemo(() => getCookieUser(), []);
    const didFetch = useRef(false);

    const updateState = (value: Partial<LeadPageStateType>) => {
        dispatch({ type: 'update', payload: value });
    };

    // ==============================
    // FETCH LEADS
    // ==============================
    const fetchLeadsData = useCallback(async (
        noLoading = false,
        paramPage = page,
        propSearch = false
    ) => {
        try {
            if (!noLoading) {
                updateState({ isLoading: true });
            }

            const response = await getLeadsData(
                paramPage + 1,
                limit,
                propSearch ? "" : search
            );

            if (response?.success) {
                updateState({
                    leads: response.leads,
                    totalRows: response.totalLeads
                });
            }
        } catch (error) {
            console.log('Error fetching leads data:', error);
        } finally {
            updateState({ isLoading: false });
        }
    }, [page, limit, search]);

    // ==============================
    // INITIAL LOAD (FIXED)
    // ==============================
    useEffect(() => {
        if (!user) {
            router.push('/');
            return;
        }

        if (didFetch.current) return;
        didFetch.current = true;

        fetchLeadsData(true);

        // ✅ activity log ONLY ONCE
        logActivity({
            userId: user.id,
            action: "LEADS_PAGE_VIEW",
            path: "/app/admin/leads",
            method: "CLIENT",
        });

    }, []);

    // ==============================
    // PAGE CHANGE
    // ==============================
    const handlePageChange = (newPage: number) => {
        updateState({ page: newPage });
        fetchLeadsData(true, newPage);

        if (user) {
            logActivity({
                userId: user.id,
                action: "LEADS_PAGE_CHANGE",
                path: "/app/admin/leads",
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
                action: "LEADS_LIMIT_CHANGE",
                path: "/app/admin/leads",
                method: "CLIENT",
                meta: {
                    limit: rows
                }
            });
        }
    };

    // ==============================
    // ADD LEAD BUTTON
    // ==============================
    const handleAddLeadClick = () => {
        dispatch({ type: 'update', payload: { isOpen: true } });

        if (user) {
            logActivity({
                userId: user.id,
                action: "ADD_LEAD_BUTTON_CLICK",
                path: "/app/admin/leads",
                method: "CLIENT",
                meta: {
                    source: "LeadsPageHeaderButton"
                }
            });
        }
    };

    return (
        <Box sx={{
            width: { xs: 'auto', md: '100%' },
            height: '100%',
            overflowX: { xs: 'scroll', md: 'hidden' },
            display: "flex",
            flexDirection: "column",
            gap: 1,
            marginTop: { xs: 1, lg: 0 }
        }}>

            <Box sx={{ width: '100%', color: theme.palette.text.primary }}>

                {/* HEADER */}
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
                    <Typography variant="h6">
                        Leads
                    </Typography>

                    {user && user.roll === 1 && (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleAddLeadClick}
                            sx={{
                                backgroundColor: "#1976d2",
                                width: "160px",
                                textTransform: "none",
                            }}
                        >
                            <AddIcon sx={{ width: 20, height: 20 }} />
                            Add Lead
                        </Button>
                    )}
                </Box>

                {/* TABLE */}
                <LeadsTable
                    totalRows={totalRows}
                    leads={leads}
                    isLoading={isLoading}
                    page={page}
                    limit={limit}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    reloadData={() => fetchLeadsData(true, page)}
                />

                {/* MODAL */}
                <AddLeadModal
                    isOpen={isOpen}
                    onClose={() =>
                        dispatch({ type: 'update', payload: { isOpen: false } })
                    }
                    handleReload={fetchLeadsData}
                />

            </Box>
        </Box>
    );
};

export default LeadsPage;