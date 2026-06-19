import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import dynamic from 'next/dynamic';
import { useTheme } from "@mui/material/styles";


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ServiceStation = () => {
    const theme = useTheme();

    const commonButtonStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: "5px",
        height: "70px",
        width: "100%"
    }

    const coloredButtonStyle = {
        ...commonButtonStyle,
        backgroundColor: "#FF6370",
        color: "#fff"
    }

    const specialButtonStyle = {
        ...commonButtonStyle,
        backgroundColor: "#A162F7",
        color: "#fff"
    }

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
        colors: ["#A162F7", "#FF6370", "#70CF97"],
        plotOptions: {
            pie: {
                startAngle: 0,
                endAngle: 360,
                donut: {
                    size: "85%",
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

    const seriesColumnChart: any = [2300, 2300, 2300];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: { xs: "100%", md: "60%" } }}>
            <Typography variant="h6" color={theme.palette.text.primary}>
                Service Station
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    {["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"].map((label) => (
                        <Box
                            key={label}
                            sx={["A4", "A10"].includes(label) || ["B1", "B7"].includes(label) ? coloredButtonStyle : commonButtonStyle}
                        >
                            {label}
                        </Box>
                    ))}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    {["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"].map((label) => (
                        <Box
                            key={label}
                            sx={label === "B9" ? specialButtonStyle : ["B1", "B7"].includes(label) ? coloredButtonStyle : commonButtonStyle}
                        >
                            {label}
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: "center", justifyContent: "center" }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "center" }}>
                    <Box sx={{ backgroundColor: "#fff", height: "10px", width: "10px", borderRadius: "100%" }} />
                    <Typography variant='body2' color={theme.palette.text.primary}>Ready</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "center" }}>
                    <Box sx={{ backgroundColor: "#FF6370", height: "10px", width: "10px", borderRadius: "100%" }} />
                    <Typography variant='body2' color={theme.palette.text.primary}>Booked</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "center" }}>
                    <Box sx={{ backgroundColor: "#A162F7", height: "10px", width: "10px", borderRadius: "100%" }} />
                    <Typography variant='body2' color={theme.palette.text.primary}>Current Station</Typography>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, width: { xs: "100%", md: "40%" }, backgroundColor: "#fff", padding: 3, borderRadius: 2 }}>
                    <Typography variant='h6'>Your Order</Typography>
                    <Chart
                        options={optionsColumnChart}
                        series={seriesColumnChart}
                        type="donut"
                        width={"100%"}
                        height="150px"
                    />
                    <Typography variant='body2'>Service Time</Typography>
                    <Typography variant='h6' color="#A162F7">5, 2h</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", width: { xs: "100%", md: "60%" }, alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: 1, borderRadius: 2, backgroundColor: "#fff" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                            <Box sx={{ backgroundColor: "#70CF97", height: "10px", width: "10px", borderRadius: "100%" }} />
                            <Typography variant='body1'>Brake fluid change</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#A162F7", backgroundColor: "#A162F71A", borderRadius: 1, padding: 1, fontWeight: "bold" }}>
                            $32
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: 1, borderRadius: 2, backgroundColor: "#fff" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                            <Box sx={{ backgroundColor: "#FF6370", height: "10px", width: "10px", borderRadius: "100%" }} />
                            <Typography variant='body1'>Diagnostics</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#A162F7", backgroundColor: "#A162F71A", borderRadius: 1, padding: 1, fontWeight: "bold" }}>
                            $32
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: 1, borderRadius: 2, backgroundColor: "#fff" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                            <Box sx={{ backgroundColor: "#A162F7", height: "10px", width: "10px", borderRadius: "100%" }} />
                            <Typography variant='body1'>External Washing</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#A162F7", backgroundColor: "#A162F71A", borderRadius: 1, padding: 1, fontWeight: "bold" }}>
                            $10
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", paddingY: 2, borderRadius: 2, backgroundColor: "#EFEBF1", fontWeight: "bold" }}>
                        <Typography variant='body1'>Add Services</Typography>
                    </Box>
                </Box>
            </Box>
            <Button sx={{ backgroundColor: "#A162F7", color: "#fff", borderRadius: 2, fontSize: "16px", fontWeight: "bold" }}>
                Pay $86
            </Button>
        </Box>
    )
}

export default ServiceStation
