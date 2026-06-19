"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CallMadeIcon from '@mui/icons-material/CallMade';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import SelectBox from "@/components/SelectBox";
import { USER_TYPES, TIME_PERIODS } from "@/constants/data";


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Offers = () => {
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.light;

    const [selectedUserType, setSelectedUserType] = useState("");
    const [selectedTimePeriod, setSelectedTimePeriod] = useState("");

    const optionsColumnChart: any = {
        chart: {
            type: "donut",
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: "#adb0bb",
            toolbar: {
                show: false,
            },
            height: 150,
        },
        colors: [secondary, "#70CF97", primary],
        plotOptions: {
            pie: {
                startAngle: 0,
                endAngle: 360,
                donut: {
                    size: "75%",
                    background: "transparent",
                },
            },
        },
        tooltip: {
            theme: theme.palette.mode === "dark" ? "dark" : "light",
            fillSeriesColor: false,
        },
        stroke: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        responsive: [
            {
                breakpoint: 991,
                options: {
                    chart: {
                        width: 120,
                    },
                },
            },
        ],
    };
    const seriesColumnChart: any = [5500, 2300];

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 3,
            }}
        >
            {/* Header Section */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: "bold", color: theme.palette.text.primary, }}>
                    Offers
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: { xs: "70%", md: "30%" }
                    }}
                >
                    {/* Dropdown for User Type */}
                    <SelectBox
                        labelId="user-type-label"
                        id="user-type"
                        name="userType"
                        label="User Type"
                        value={selectedUserType}
                        onChange={(e) => setSelectedUserType(e.target.value)}
                        options={USER_TYPES}
                        size="small"
                        fullWidth
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
                        fullWidth
                    />
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between", gap: 3, padding: 2, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, borderRadius: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <Typography variant="h6">Killan James</Typography>
                    <Typography><span className="text-[#FF6370] pr-2 text-[16px] font-semibold">$16,605</span>average price</Typography>
                    <Typography>market average is $16,224</Typography>
                    <Box sx={{ backgroundColor: "#FF6370", padding: "1px", borderRadius: 10, color: "#fff", width: 50, alignItems: "center", justifyContent: "center", display: "flex" }}>
                        <ArrowRightAltIcon />
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Chart
                        options={optionsColumnChart}
                        series={seriesColumnChart}
                        type="donut"
                        width={"100%"}
                        height="120px"
                    />
                    <Typography variant="body1" color="#70CF97">45% Excellent</Typography>
                    <Typography variant="body2">Impression Share</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", padding: 1, backgroundColor: "#407EF91A", color: "#407EF9", width: "60%" }}>
                        <DirectionsCarIcon />
                    </Box>
                    <Typography variant="h6" color="#407EF9">$1,174</Typography>
                    <Typography variant="body2">Model Spend</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", padding: 1, backgroundColor: "#FF7E861A", color: "#FF6370", width: "60%" }}>
                        <CallMadeIcon />
                    </Box>
                    <Typography variant="h6" color="#FF6370">$1,174</Typography>
                    <Typography variant="body2">Model Spend</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", padding: 1, backgroundColor: "#A162F71A", color: "#A162F7", width: "40%" }}>
                        <MonetizationOnIcon />
                    </Box>
                    <Typography variant="h6" color="#A162F7">$811</Typography>
                    <Typography variant="body2">Spend per Unit Turned</Typography>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between", gap: 5, padding: 2, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, borderRadius: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <Typography variant="h6">Killan James</Typography>
                    <Typography><span className="text-[#FF6370] pr-2 text-[16px] font-semibold">$16,605</span>average price</Typography>
                    <Typography>market average is $16,224</Typography>
                    <Box sx={{ backgroundColor: "#FF6370", padding: "1px", borderRadius: 10, color: "#fff", width: 50, alignItems: "center", justifyContent: "center", display: "flex" }}>
                        <ArrowRightAltIcon />
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Chart
                        options={optionsColumnChart}
                        series={seriesColumnChart}
                        type="donut"
                        width={"100%"}
                        height="120px"
                    />
                    <Typography variant="body1" color="#70CF97">45% Excellent</Typography>
                    <Typography variant="body2">Impression Share</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", padding: 1, backgroundColor: "#407EF91A", color: "#407EF9", width: "60%" }}>
                        <DirectionsCarIcon />
                    </Box>
                    <Typography variant="h6" color="#407EF9">$1,174</Typography>
                    <Typography variant="body2">Model Spend</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", padding: 1, backgroundColor: "#FF7E861A", color: "#FF6370", width: "60%" }}>
                        <CallMadeIcon />
                    </Box>
                    <Typography variant="h6" color="#FF6370">$1,174</Typography>
                    <Typography variant="body2">Model Spend</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", padding: 1, backgroundColor: "#A162F71A", color: "#A162F7", width: "40%" }}>
                        <MonetizationOnIcon />
                    </Box>
                    <Typography variant="h6" color="#A162F7">$811</Typography>
                    <Typography variant="body2">Spend per Unit Turned</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Offers;
