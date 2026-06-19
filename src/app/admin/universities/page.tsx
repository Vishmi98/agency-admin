'use client';

import { useState } from 'react';
import { Button, Box, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import UniversitiesTable from '@/modules/university/ui/UniversitiesTable';
import AddUniversityModal from '@/modules/university/ui/AddUniversityModal';


const UniversitiesPage = () => {
    const [open, setOpen] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
    const theme = useTheme();

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
                        Universities
                    </Typography>
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
                </Box>
                <UniversitiesTable reload={reloadTable} />
            </Box>
        </>
    )
}

export default UniversitiesPage