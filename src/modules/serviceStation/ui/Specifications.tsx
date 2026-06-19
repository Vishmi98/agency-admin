"use client"

import React from 'react'
import Image from 'next/image'
import { Box, Grid, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';


const Specifications = () => {
    const theme = useTheme();

    const BorderLinearProgress = styled(LinearProgress)(({ theme, color }) => ({
        height: 8,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[200],
            ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.grey[800],
            }),
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: color || '#A162F7',
            ...theme.applyStyles('dark', {
                backgroundColor: color || '#308fe8',
            }),
        },
    }));

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, padding: 2, borderRadius: 2, alignItems: "center", justifyContent: "center" }}>
            <Grid container spacing={5}>
                <Grid item xs={12} md={6} lg={3}>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                        <Image
                            src="/p1.png"
                            alt=''
                            width={80}
                            height={80}
                            className='mb-5'
                        />
                        <Typography variant='h6'>Oil Level</Typography>
                        <Box sx={{ display: "flex", gap: 2, marginY: 1 }}>
                            <Typography variant='body2' sx={{ borderRight: 1, paddingRight: 2 }}>Engine</Typography>
                            <Typography variant='body2'>Don&apos; Replace</Typography>
                        </Box>
                        <BorderLinearProgress variant="determinate" value={70} sx={{ "& .MuiLinearProgress-bar": { backgroundColor: "#A162F7" } }} />
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                        <Image
                            src="/p2.png"
                            alt=''
                            width={80}
                            height={80}
                            className='mb-5'
                        />
                        <Typography variant='h6'>Brake Pads</Typography>
                        <Box sx={{ display: "flex", gap: 2, marginY: 1 }}>
                            <Typography variant='body2' sx={{ borderRight: 1, paddingRight: 2 }}>Wheels</Typography>
                            <Typography variant='body2'>Still Good</Typography>
                        </Box>
                        <BorderLinearProgress variant="determinate" value={40} sx={{ "& .MuiLinearProgress-bar": { backgroundColor: "#70CF97" } }} />
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                        <Image
                            src="/p3.png"
                            alt=''
                            width={80}
                            height={80}
                            className='mb-5'
                        />
                        <Typography variant='h6'>Steering</Typography>
                        <Box sx={{ display: "flex", gap: 2, marginY: 1 }}>
                            <Typography variant='body2' sx={{ borderRight: 1, paddingRight: 2 }}>Drivetrain</Typography>
                            <Typography variant='body2'>Need Change</Typography>
                        </Box>
                        <BorderLinearProgress variant="determinate" value={30} sx={{ "& .MuiLinearProgress-bar": { backgroundColor: "#FFB800" } }} />
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                        <Image
                            src="/p4.png"
                            alt=''
                            width={80}
                            height={80}
                            className='mb-5'
                        />
                        <Typography variant='h6'>Oil Level</Typography>
                        <Box sx={{ display: "flex", gap: 2, marginY: 1 }}>
                            <Typography variant='body2' sx={{ borderRight: 1, paddingRight: 2 }}>Engine</Typography>
                            <Typography variant='body2'>Don&apos;t Replace</Typography>
                        </Box>
                        <BorderLinearProgress variant="determinate" value={80} sx={{ "& .MuiLinearProgress-bar": { backgroundColor: "#FF764C" } }} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Specifications
