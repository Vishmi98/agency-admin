'use client';

import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import AddStudent from '@/modules/student/ui/AddStudent';
import { getCookieUser } from '@/utils/cookie.util';


const AddStudentPage = () => {
    const theme = useTheme();
    const user = getCookieUser()
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    return (
        <Box
            sx={{
                width: '100%',
                color: theme.palette.text.primary,
                borderRadius: "5px",
                marginTop: { xs: 3, lg: 0 }
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
                <Typography variant="h6" color={theme.palette.text.primary}>
                    Add Student
                </Typography>
            </Box>
            <Box
                sx={{
                    backgroundColor: "#fff",
                    paddingX: "10px",
                    paddingY: "10px",
                    borderRadius: "5px",
                    width: "100%",
                    marginTop: 3
                }}
            >
                <AddStudent />
            </Box>
        </Box>
    )
}

export default AddStudentPage