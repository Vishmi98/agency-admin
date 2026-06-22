'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { Button, Box, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { leadPageInitialState, leadPageReducer, LeadPageStateType } from '@/modules/leads/leads.types';
import { getLeadsData } from '@/modules/leads/leads.service';
import LeadsTable from '@/modules/leads/ui/LeadsTable';
import AddLeadModal from '@/modules/leads/ui/AddLeadModal';


const LeadsPage = () => {
    const theme = useTheme();

    const [state, dispatch] = useReducer(leadPageReducer, leadPageInitialState);
    const { leads, isLoading, page, limit, totalRows, search, isOpen } = state;

    const updateState = (value: Partial<LeadPageStateType>) => {
        dispatch({ type: 'update', payload: value });
    };

    const fetchLeadsData = useCallback(async (noLoading = false, paramPage = page, propSearch = false) => {
        try {
            if (!noLoading) {
                updateState({ isLoading: true });
            }
            const response = await getLeadsData(paramPage + 1, limit, propSearch ? "" : search);
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


    useEffect(() => {
        fetchLeadsData(true);
    }, [limit]);

    const handlePageChange = (newPage: number) => {
        updateState({ page: newPage });
        fetchLeadsData(true, newPage);
    };

    const handleRowsPerPageChange = (rows: number) => {
        updateState({ limit: rows, page: 0 });
    };

    const handleSearch = async () => {
        updateState({ page: 0, limit: 5 });
        await fetchLeadsData(false, 0);
    };

    const handleClearSearch = async () => {
        updateState({ search: '', page: 0, limit: 5 });
        await fetchLeadsData(false, 0, true);
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
                {/* <LeadSearch
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
                            Leads
                        </Typography>
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
                                Add Lead
                            </Button>
                            <AddLeadModal
                                isOpen={isOpen}
                                onClose={() => dispatch({ type: 'update', payload: { isOpen: false } })}
                                handleReload={fetchLeadsData}
                            />
                        </Box>
                    </Box>
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
                </Box>
            </Box>
        </>
    )
}

export default LeadsPage