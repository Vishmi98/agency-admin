'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

import CountriesTable from '@/modules/countries/ui/Countries';
import AddCountryModal from '@/modules/countries/ui/AddCountryModal';
import { getCookieUser } from '@/utils/cookie.util';


const CountriesPage = () => {
    const [open, setOpen] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
    const theme = useTheme();
    const user = getCookieUser()
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    const handleClickOpen = () => setOpen(true);
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
                        Countries
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
                                    Add Country
                                </Button>
                                <AddCountryModal
                                    isOpen={open}
                                    onClose={handleClose}
                                    handleReload={handleReload}
                                />
                            </Box>
                        )
                    }
                </Box>
                <CountriesTable reload={reloadTable} />
            </Box>
        </>
    )
}

export default CountriesPage