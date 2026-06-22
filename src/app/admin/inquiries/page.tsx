'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

import { inquiryPageInitialState, inquiryPageReducer, InquiryPageStateType } from '@/modules/inquiries/inquiries.types';
import { getInquiriesData } from '@/modules/inquiries/inquiries.service';
import InquiriesTable from '@/modules/inquiries/ui/InquiriesTable';


const InquiriesPage = () => {
    const theme = useTheme();

    const [state, dispatch] = useReducer(inquiryPageReducer, inquiryPageInitialState);
    const { inquiries, isLoading, page, limit, totalRows, search } = state;

    const updateState = (value: Partial<InquiryPageStateType>) => {
        dispatch({ type: 'update', payload: value });
    };

    const fetchInquiriesData = useCallback(async (noLoading = false, paramPage = page, propSearch = false) => {
        try {
            if (!noLoading) {
                updateState({ isLoading: true });
            }
            const response = await getInquiriesData(paramPage + 1, limit, propSearch ? "" : search);
            if (response?.success) {
                updateState({
                    inquiries: response.inquiries,
                    totalRows: response.totalInquiries
                });
            }
        } catch (error) {
            console.log('Error fetching inquiries data:', error);
        } finally {
            updateState({ isLoading: false });
        }
    }, [page, limit, search]);


    useEffect(() => {
        fetchInquiriesData(true);
    }, [limit]);

    const handlePageChange = (newPage: number) => {
        updateState({ page: newPage });
        fetchInquiriesData(true, newPage);
    };

    const handleRowsPerPageChange = (rows: number) => {
        updateState({ limit: rows, page: 0 });
    };

    const handleSearch = async () => {
        updateState({ page: 0, limit: 5 });
        await fetchInquiriesData(false, 0);
    };

    const handleClearSearch = async () => {
        updateState({ search: '', page: 0, limit: 5 });
        await fetchInquiriesData(false, 0, true);
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
                            Inquiries
                        </Typography>
                    </Box>
                    <InquiriesTable
                        totalRows={totalRows}
                        inquiries={inquiries}
                        isLoading={isLoading}
                        page={page}
                        limit={limit}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        reloadData={() => fetchInquiriesData(true, page)}
                    />
                </Box>
            </Box>
        </>
    )
}

export default InquiriesPage