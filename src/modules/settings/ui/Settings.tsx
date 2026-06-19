"use client";

import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography, useTheme } from '@mui/material';

import Profile from './Profile';
import { TabPanelProps } from '../settings.types';


const CustomTabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ padding: 2 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

const a11yProps = (index: number) => {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
};

const Settings = () => {
    const [value, setValue] = useState(0);
    const theme = useTheme();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="settings tabs"
                sx={{
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 'medium',
                        minWidth: 100,
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&.Mui-selected': {
                            color: theme.palette.text.primary,
                            backgroundColor: '#A162F71A',
                            borderRadius: 2,
                        },
                    },
                    '& .MuiTabs-indicator': {
                        display: "none"
                    },
                }}
            >
                <Tab label="My details" {...a11yProps(0)} />
                <Tab label="Profile" {...a11yProps(1)} />
                <Tab label="Password" {...a11yProps(2)} />
                <Tab label="Email" {...a11yProps(3)} />
                <Tab label="Notification" {...a11yProps(4)} />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
                <Typography variant="h6" color="text.primary">
                    Content for Item One
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    This is the detailed content for the first tab.
                </Typography>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Profile />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <Typography variant="h6" color="text.primary">
                    Content for Item Three
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    This is the detailed content for the third tab.
                </Typography>
            </CustomTabPanel>
        </Box>
    );
};

export default Settings;
