'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';

import { getCookieUser } from '@/utils/cookie.util';
import { logActivity } from '@/utils/logActivity';
import LogsTable from '@/modules/logs/ui/LogsTable';


const LogsPage = () => {
    const [reloadTable, setReloadTable] = useState(false);
    const theme = useTheme();
    const user = useMemo(() => getCookieUser(), []);
    const didFetch = useRef(false);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
            return;
        }

        if (didFetch.current) return;
        didFetch.current = true;

        // 📌 PAGE VIEW LOG
        // logActivity({
        //     userId: user.id,
        //     action: "LOGS_PAGE_VIEW",
        //     path: "/app/admin/logs",
        //     method: "CLIENT",
        // });

    }, []);

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    color: theme.palette.text.primary,
                    borderRadius: "5px",
                    marginTop: { xs: 1, lg: 0 }
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
                    <Typography variant="h6" color={theme.palette.text.primary}>
                        Activity Logs
                    </Typography>
                </Box>
                <LogsTable reload={reloadTable} />
            </Box>
        </>
    )
}

export default LogsPage