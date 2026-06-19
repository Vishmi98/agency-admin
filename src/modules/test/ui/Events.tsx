"use client"

import React, { useState } from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography, useTheme } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { DATE_TYPES, PAYMENT_STATUSES, TIME_PERIODS, USER_TYPES } from '@/constants/data';
import SelectBox from '@/components/SelectBox';


const Events = () => {
    const [selectedUserType, setSelectedUserType] = useState('');
    const [selectedTimePeriod, setSelectedTimePeriod] = useState('');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
    const [dateType, setDateType] = React.useState('');
    const theme = useTheme();

    const handleChange = (event: SelectChangeEvent, setter: React.Dispatch<React.SetStateAction<any>>) => {
        setter(event.target.value);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: { xs: "100%", md: "60%" } }}>
            <Box sx={{ display: 'flex', gap: 3, width: '100%' }}>
                <SelectBox
                    labelId="user-type-label"
                    id="user-type"
                    name="userType"
                    label="User Type"
                    value={selectedUserType}
                    onChange={(e) => setSelectedUserType(e.target.value)}
                    options={USER_TYPES}
                    size="small"
                />

                {/* Dropdown for Time Period */}
                <SelectBox
                    labelId="time-period-label"
                    id="time-period"
                    name="timePeriod"
                    label="Time Period"
                    value={selectedTimePeriod}
                    onChange={(e) => setSelectedTimePeriod(e.target.value)}
                    options={TIME_PERIODS}
                    size="small"
                />

                {/* Dropdown for Payment Status */}
                <SelectBox
                    labelId="payment-status-label"
                    id="payment-status"
                    name="paymentStatus"
                    label="Payment Status"
                    value={selectedPaymentStatus}
                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                    options={PAYMENT_STATUSES}
                    size="small"
                />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: theme.palette.background.default, borderRadius: 2 }}>
                <Box
                    sx={{
                        backgroundColor: "#2884FF",
                        padding: 2,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 3,
                    }}
                >
                    <FormControl fullWidth size="small" sx={{ width: "20%" }}>
                        <InputLabel id="date-type-select-label">Type</InputLabel>
                        <Select
                            labelId="date-type-select-label"
                            id="date-type-select"
                            value={dateType}
                            label="Date Type"
                            onChange={(event) => handleChange(event, setDateType)}
                            sx={{
                                backgroundColor: "#fff",
                                fontSize: '14px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#0000ff',
                                },
                            }}
                        >
                            {DATE_TYPES.map((date) => (
                                <MenuItem key={date.value} value={date.value}>
                                    {date.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 1,
                            borderRadius: 2,
                            backgroundColor: "#fff",
                            minHeight: "40px",
                            width: "fit-content",
                            fontSize: "12px"
                        }}
                    >
                        <CalendarMonthIcon sx={{ color: "#0000ff" }} />
                        Mar 15, 2022
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 1,
                            borderRadius: 2,
                            backgroundColor: "#fff",
                            minHeight: "40px",
                            width: "fit-content",
                            cursor: "pointer"
                        }}
                    >
                        <KeyboardArrowLeftIcon sx={{ color: "#0000ff" }} />
                        <KeyboardArrowRightIcon sx={{ color: "#0000ff" }} />
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                    }}
                >
                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ width: "15%", padding: "5px" }}>
                            <Typography variant='body2'>
                                08:00 AM
                            </Typography>
                        </Box>
                        <Box sx={{ height: "100%", backgroundColor: "#ccc", width: "1px" }} />
                        <Box sx={{ width: "85%", position: "relative" }}>
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    position: "absolute",
                                    bottom: -15,
                                    left: 20,
                                    backgroundColor: "#A062F733",
                                    padding: 0.5,
                                    flexDirection: "column",
                                    gap: 1,
                                    width: "80%",
                                    color: "#fff",
                                    borderRadius: "12px",
                                }}
                            >
                                <Box sx={{ backgroundColor: "#A162F7", borderRadius: "12px", padding: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, }}>
                                        <Typography variant='body2'>
                                            08:00 am
                                        </Typography>
                                        <Typography variant='body2'>
                                            154K
                                        </Typography>
                                    </Box>
                                    <Typography variant='body1'>
                                        Motor Track Day
                                    </Typography>
                                    <Typography variant='body2'>
                                        All Motorbikes
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ width: "15%", padding: "5px" }}>
                            <Typography variant='body2'>
                                09:00 AM
                            </Typography>
                        </Box>
                        <Box sx={{ height: "100%", backgroundColor: "#ccc", width: "1px" }} />
                        <Box sx={{ width: "85%", position: "relative" }}>
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    position: "absolute",
                                    bottom: -65,
                                    left: 20,
                                    backgroundColor: "#725CFF",
                                    padding: 0.5,
                                    flexDirection: "column",
                                    gap: 1,
                                    width: "80%",
                                    color: "#fff",
                                    borderRadius: "12px",
                                    zIndex: 10
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, }}>
                                    <Typography variant='body2'>
                                        09:45 am
                                    </Typography>
                                    <Typography variant='body2'>
                                        1h 45min
                                    </Typography>
                                </Box>
                                <Typography variant='body1'>
                                    Drift Series Second Round
                                </Typography>
                                <Typography variant='body2' marginBottom={5}>
                                    JDM
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ width: "15%", padding: "5px" }}>
                            <Typography variant='body2'>
                                10:00 AM
                            </Typography>
                        </Box>
                        <Box sx={{ height: "100%", backgroundColor: "#ccc", width: "1px" }} />
                        <Box sx={{ width: "85%", position: "relative" }}>
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                            <Box sx={{ padding: "20px" }}></Box>
                        </Box>
                    </Box>
                    <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ width: "15%", padding: "5px" }}>
                            <Typography variant='body2'>
                                11:00 AM
                            </Typography>
                        </Box>
                        <Box sx={{ height: "100%", backgroundColor: "#ccc", width: "1px" }} />
                        <Box sx={{ width: "85%", position: "relative" }}>
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    position: "absolute",
                                    bottom: -55,
                                    left: 20,
                                    backgroundColor: "#2884FF33",
                                    padding: 0.5,
                                    flexDirection: "column",
                                    gap: 1,
                                    width: "38%",
                                    color: "#fff",
                                    borderRadius: "12px",
                                    zIndex: 10
                                }}
                            >
                                <Box sx={{ backgroundColor: "#2884FF", borderRadius: "12px", padding: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, }}>
                                        <Typography variant='body2'>
                                            10:00 am
                                        </Typography>
                                        <Typography variant='body2'>
                                            154K
                                        </Typography>
                                    </Box>
                                    <Typography variant='body1'>
                                        Motor Track Day
                                    </Typography>
                                    <Typography variant='body2' marginBottom={5}>
                                        All Motorbikes
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    position: "absolute",
                                    bottom: -55,
                                    left: { xs: 150, md: 225 },
                                    backgroundColor: "#2884FF33",
                                    padding: 0.5,
                                    flexDirection: "column",
                                    gap: 1,
                                    width: "38%",
                                    color: "#fff",
                                    borderRadius: "12px",
                                    zIndex: 10
                                }}
                            >
                                <Box sx={{ backgroundColor: "#fff", borderRadius: "12px", padding: 1, color: "#000" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, }}>
                                        <Typography variant='body2'>
                                            08:00 am
                                        </Typography>
                                        <Typography variant='body2'>
                                            154K
                                        </Typography>
                                    </Box>
                                    <Typography variant='body1'>
                                        Motor Track Day
                                    </Typography>
                                    <Typography variant='body2' marginBottom={5}>
                                        All Motorbikes
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ width: "15%", padding: "5px" }}>
                            <Typography variant='body2'>
                                12:00 AM
                            </Typography>
                        </Box>
                        <Box sx={{ height: "100%", backgroundColor: "#ccc", width: "1px" }} />
                        <Box sx={{ width: "85%", position: "relative" }}>
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    position: "absolute",
                                    bottom: -55,
                                    left: 20,
                                    backgroundColor: "#56C57A33",
                                    padding: 0.5,
                                    flexDirection: "column",
                                    gap: 1,
                                    width: "80%",
                                    color: "#fff",
                                    borderRadius: "12px",
                                    zIndex: 10
                                }}
                            >
                                <Box sx={{ backgroundColor: "#70CF97", borderRadius: "12px", padding: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, }}>
                                        <Typography variant='body2'>
                                            08:00 am
                                        </Typography>
                                        <Typography variant='body2'>
                                            154K
                                        </Typography>
                                    </Box>
                                    <Typography variant='body1'>
                                        Motor Track Day
                                    </Typography>
                                    <Typography variant='body2'>
                                        All Motorbikes
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ width: "15%", padding: "5px" }}>
                            <Typography variant='body2'>
                                01:00 AM
                            </Typography>
                        </Box>
                        <Box sx={{ height: "100%", backgroundColor: "#ccc", width: "1px" }} />
                        <Box sx={{ width: "85%", position: "relative" }}>
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    position: "absolute",
                                    bottom: -85,
                                    left: 20,
                                    backgroundColor: "#FF764C33",
                                    padding: 0.5,
                                    flexDirection: "column",
                                    gap: 1,
                                    width: "80%",
                                    color: "#fff",
                                    borderRadius: "12px",
                                    zIndex: 10
                                }}
                            >
                                <Box sx={{ backgroundColor: "#FF764C", borderRadius: "12px", padding: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, }}>
                                        <Typography variant='body2'>
                                            08:00 am
                                        </Typography>
                                        <Typography variant='body2'>
                                            154K
                                        </Typography>
                                    </Box>
                                    <Typography variant='body1'>
                                        Motor Track Day
                                    </Typography>
                                    <Typography variant='body2' marginBottom={3}>
                                        All Motorbikes
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ width: "15%", padding: "5px" }}>
                            <Typography variant='body2'>
                                02:00 AM
                            </Typography>
                        </Box>
                        <Box sx={{ height: "100%", backgroundColor: "#ccc", width: "1px" }} />
                        <Box sx={{ width: "85%", position: "relative" }}>
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    position: "absolute",
                                    bottom: -120,
                                    left: 20,
                                    backgroundColor: "#E0E4EC",
                                    padding: 0.5,
                                    flexDirection: "column",
                                    gap: 1,
                                    width: "80%",
                                    color: "#fff",
                                    borderRadius: "12px",
                                }}
                            >
                                <Box sx={{ backgroundColor: "#fff", borderRadius: "12px", padding: 1, color: "#000" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, }}>
                                        <Typography variant='body2'>
                                            08:00 am
                                        </Typography>
                                        <Typography variant='body2'>
                                            154K
                                        </Typography>
                                    </Box>
                                    <Typography variant='body1'>
                                        Motor Track Day
                                    </Typography>
                                    <Typography variant='body2' marginBottom={3}>
                                        All Motorbikes
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ width: "15%", padding: "5px" }}>
                            <Typography variant='body2'>
                                03:00 AM
                            </Typography>
                        </Box>
                        <Box sx={{ height: "100%", backgroundColor: "#ccc", width: "1px" }} />
                        <Box sx={{ width: "85%" }}>
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                            <Box sx={{ padding: "20px" }}></Box>
                        </Box>
                    </Box>
                    <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ width: "15%", padding: "5px" }}>
                            <Typography variant='body2'>
                                04:00 AM
                            </Typography>
                        </Box>
                        <Box sx={{ height: "100%", backgroundColor: "#ccc", width: "1px" }} />
                        <Box sx={{ width: "85%" }}>
                            <Box sx={{ padding: "20px" }}></Box>
                            <Box sx={{ width: "100%", backgroundColor: "#ccc", height: "1px" }} />
                            <Box sx={{ padding: "20px" }}></Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Events