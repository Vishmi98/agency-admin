"use client"

import React from 'react';
import { Avatar, Box, InputBase, Typography, alpha } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import PushPinIcon from '@mui/icons-material/PushPin';
import DoneAllIcon from '@mui/icons-material/DoneAll';


const Messages = () => {
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.black, 0.05),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.black, 0.1),
        },
        marginLeft: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            width: 'auto',
        },
    }));

    // Wrapper for the search icon
    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#7C7C8D',
    }));

    // Styled input base for the search bar
    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: '#7C7C8D',
        width: '100%',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1.5, 1, 1.5, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            fontSize: '0.875rem',
            width: '100%',
        },
    }));

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '30%' }}>
            {/* Header Section */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    width: '100%',
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    Messages
                </Typography>
                <BorderColorIcon sx={{ color: '#A162F7', width: 20, height: 20 }} />
            </Box>

            {/* Search Bar */}
            <Search>
                <SearchIconWrapper>
                    <SearchIcon sx={{ color: '#7C7C8D' }} />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                />
            </Search>
            <Box sx={{ display: "flex", gap: 1 }}>
                <PushPinIcon sx={{ color: "#A9ABAD", width: 18, height: 18 }} />
                <Typography sx={{ fontSize: "12px", color: "#A9ABAD" }}>PINNED</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", justifyContent: "flex-start" }}>
                    <Avatar src='/p6.jpg' sx={{ width: 50, height: 50 }} />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography variant='h6'>Killan James</Typography>
                        <Typography sx={{ fontSize: "12px", color: "#258C60" }}>Typing...</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end", justifyContent: "space-between", height: "100%" }}>
                    <Typography sx={{ fontSize: "12px", color: "#A9ABAD" }}>4:30 PM</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "100%", backgroundColor: "#FF6370", color: "#fff", width: 15, height: 15, fontSize: "10px" }}>
                        2
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", justifyContent: "flex-start" }}>
                    <Avatar src='/p7.jpg' sx={{ width: 50, height: 50 }} />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography variant='h6'>Desian Tam</Typography>
                        <Typography sx={{ fontSize: "12px" }}>Hello! Everyone</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end", justifyContent: "space-between", height: "100%" }}>
                    <Typography sx={{ fontSize: "12px", color: "#A9ABAD" }}>9:36 AM</Typography>
                    <DoneAllIcon sx={{ width: 15, height: 15, color: "#41D37E" }} />
                </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", justifyContent: "flex-start" }}>
                    <Avatar src='/p8.jpg' sx={{ width: 50, height: 50 }} />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography variant='h6'>Ahmed Medi</Typography>
                        <Typography sx={{ fontSize: "12px", color: "#258C60" }}>Typing...</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end", justifyContent: "space-between", height: "100%" }}>
                    <Typography sx={{ fontSize: "12px", color: "#A9ABAD" }}>4:30 PM</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "100%", backgroundColor: "#FF6370", color: "#fff", width: 15, height: 15, fontSize: "10px" }}>
                        2
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Messages;
