'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';

import { inquiryPageInitialState, inquiryPageReducer, InquiryPageStateType } from '@/modules/inquiries/inquiries.types';
import { getInquiriesData } from '@/modules/inquiries/inquiries.service';
import InquiriesTable from '@/modules/inquiries/ui/InquiriesTable';
import { getCookieUser } from '@/utils/cookie.util';
import { logActivity } from '@/utils/logActivity';


const InquiriesPage = () => {
    const theme = useTheme();

    const [state, dispatch] = useReducer(inquiryPageReducer, inquiryPageInitialState);
    const { inquiries, isLoading, page, limit, totalRows, search } = state;
    const user = useMemo(() => getCookieUser(), []);
    const didFetch = useRef(false);
    const router = useRouter();

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
        if (!user) {
            router.push('/');
            return;
        }

        if (didFetch.current) return;
        didFetch.current = true;

        fetchInquiriesData(true);

        // ✅ activity log ONLY ONCE
        logActivity({
            userId: user.id,
            action: "INQUIRIES_PAGE_VIEW",
            path: "/app/admin/inquiries",
            method: "CLIENT",
        });

    }, []);

    const handlePageChange = (newPage: number) => {
        updateState({ page: newPage });
        fetchInquiriesData(true, newPage);

        if (user) {
            logActivity({
                userId: user.id,
                action: "INQUIRIES_PAGE_CHANGE",
                path: "/app/admin/inquiries",
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
                action: "INQUIRIES_LIMIT_CHANGE",
                path: "/app/admin/inquiries",
                method: "CLIENT",
                meta: {
                    limit: rows
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