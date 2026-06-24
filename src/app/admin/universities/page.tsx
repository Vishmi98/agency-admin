'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Box, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

import UniversitiesTable from '@/modules/university/ui/UniversitiesTable';
import AddUniversityModal from '@/modules/university/ui/AddUniversityModal';
import { getCookieUser } from '@/utils/cookie.util';
import { logActivity } from '@/utils/logActivity';


const UniversitiesPage = () => {
    const [open, setOpen] = useState(false);
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
        logActivity({
            userId: user.id,
            action: "UNIVERSITIES_PAGE_VIEW",
            path: "/app/admin/universities",
            method: "CLIENT",
        });

    }, []);

    const handleClickOpen = () => {
        setOpen(true);

        if (user) {
            // 📌 BUTTON CLICK LOG
            logActivity({
                userId: user.id,
                action: "ADD_UNIVERSITY_BUTTON_CLICK",
                path: "/app/admin/universities",
                method: "CLIENT",
                meta: {
                    source: "UniversitiesPageHeaderButton"
                }
            });
        }
    };

    const handleClose = () => setOpen(false);

    const handleReload = () => {
        setReloadTable((prev) => !prev);
    };

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
                        Universities
                    </Typography>
                    {
                        user && user.roll === 1 && (
                            <Box display="flex" justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleClickOpen}
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
                                    Add University
                                </Button>
                                <AddUniversityModal
                                    isOpen={open}
                                    onClose={handleClose}
                                    handleReload={handleReload}
                                />
                            </Box>
                        )
                    }
                </Box>
                <UniversitiesTable reload={reloadTable} />
            </Box>
        </>
    )
}

export default UniversitiesPage