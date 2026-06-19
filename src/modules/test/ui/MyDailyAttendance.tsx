"use client";

import React, { useEffect, useState } from "react";
import { Box, useTheme, Typography, Stack, CircularProgress } from "@mui/material";

import { AttendanceRecordType, DailyAttendanceProps } from "../test.types";
import { getMyAttendance } from "../service/test.service";

import { getCookieUser } from "@/utils/cookie.util";


const workingHours = Array.from({ length: 12 }, (_, i) => {
    const hour = 7 + i;
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour > 12 ? hour - 12 : hour;
    return `${formattedHour.toString().padStart(2, '')}.00 ${period}`;
});

const MyDailyAttendance: React.FC<DailyAttendanceProps> = ({ selectedDate: initialDate }) => {
    const theme = useTheme();
    
    const user = getCookieUser();

    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
    const [attendanceData, setAttendanceData] = useState<AttendanceRecordType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setSelectedDate(initialDate);
    }, [initialDate]);

    useEffect(() => {
        const loadAttendance = async () => {
            setLoading(true);
            if (typeof user === "object" && user.id) {
                const { data } = await getMyAttendance(
                    selectedDate.toISOString().split("T")[0],
                    user.id
                );
                setAttendanceData(data);
                setLoading(false);
            }
        };
        loadAttendance();
    }, [selectedDate]);

    const parseTime = (timeStr: string): Date => {
        timeStr = timeStr.replace(".", ":").trim();
        const [time, period] = timeStr.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        let hour = period === "PM" && hours !== 12 ? hours + 12 : hours;
        hour = period === "AM" && hours === 12 ? 0 : hour;
        return new Date(0, 0, 0, hour, minutes);
    };

    const calWorkingHours = (startTime: string, endTime: string): number => {
        try {
            const start = parseTime(startTime);
            const end = parseTime(endTime);
            const diffMs = end.getTime() - start.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            return diffHours * 40;
        } catch {
            return 0;
        }
    };

    const getOffsetTop = (shiftStartTime: string, workStartTime: string): number => {
        try {
            const shift = parseTime(shiftStartTime);
            const work = parseTime(workStartTime);
            const diffMs = work.getTime() - shift.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            return diffHours * (diffHours >= 0 ? 5 : 4);
        } catch {
            return 0;
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
                {[
                    { color: "#a9e2c0", label: "Shift A" },
                    { color: "#d0b0fb", label: "Shift B" },
                    { color: "transparent", label: "Working Time", border: "2px dashed red" },
                    { color: "#ffa6a6", label: "Absent" },
                ].map(({ color, label, border }) => (
                    <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                            sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: color,
                                borderRadius: "5px",
                                border: border || "none",
                            }}
                        />
                        <Typography variant="body2">{label}</Typography>
                    </Box>
                ))}
            </Box>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <CircularProgress />
                </Box>
            ) : !attendanceData ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                    <Typography variant="h6" color="textSecondary">
                        No data available for {(new Date(selectedDate.getTime() - 86400000)).toLocaleDateString()}
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: theme.palette.background.default, borderRadius: 2, gap: 3 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ width: "15%", fontSize: "12px", fontWeight: "bold" }}>
                                    {workingHours.map(time => (
                                        <Box key={time} sx={{ height: "40px", display: "flex", alignItems: "center" }}>{time}</Box>
                                    ))}
                                </Box>
                                <Box sx={{ height: "100%", backgroundColor: "#ccc", width: "1px", marginRight: 2 }} />

                                <Stack sx={{ width: "85%", overflowX: "auto", flexDirection: "row", gap: 3, position: "relative" }}>
                                    {[attendanceData].map((staff, index) => {
                                        const today = new Date();
                                        const staffStartTime = staff.startTime ? new Date(staff.startTime) : null;
                                        const staffEndTime = staff.endTime ? new Date(staff.endTime) : null;

                                        const isAbsent =
                                            (!staffStartTime || !staffEndTime) &&
                                            new Date(selectedDate) < today;

                                        return (
                                            <Box key={`${staff.staffId}-${index}`}>
                                                <Box sx={{
                                                    backgroundColor: isAbsent ? "#ffa6a6" : (staff.shiftInfo?.name === "B" ? "#d0b0fb" : "#a9e2c0"),
                                                    height: 362,
                                                    marginTop: staff.shiftInfo?.name == "B" ? 10 : 5,
                                                    width: 80,
                                                    borderRadius: "12px"
                                                }}>
                                                    {staff.startTime && staff.endTime ?
                                                        <>
                                                            <Box sx={{
                                                                border: "2px dashed red",
                                                                backgroundColor: "transparent",
                                                                borderRadius: "12px",
                                                                height: calWorkingHours(staff.startTime, staff.endTime),
                                                                width: 80,
                                                                position: "absolute",
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                textAlign: "center",
                                                                marginTop: getOffsetTop(staff.shiftInfo?.startTime, staff.startTime),
                                                            }}>
                                                                <Typography variant='body2' sx={{}}>{staff.startTime}</Typography>
                                                                <Box sx={{ height: "85%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                                                                    <Typography variant='body2' sx={{ transform: "rotate(-90deg)" }}>{staff.name}</Typography>
                                                                </Box>
                                                                <Typography variant='body2' sx={{}}>{staff.endTime}</Typography>
                                                            </Box>
                                                        </>
                                                        :
                                                        <Box sx={{ padding: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: "100%", transform: "rotate(-90deg)" }}>
                                                            <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>{staff.name}</Typography>
                                                        </Box>
                                                    }
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};


export default MyDailyAttendance;
