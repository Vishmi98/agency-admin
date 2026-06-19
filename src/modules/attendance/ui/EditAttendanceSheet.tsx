"use client"

import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import AttendanceOptionModal from './AttendanceModal';
import { AttendanceData, AttendanceType, EditAttendanceSheetProps } from '../attendance.types';
import { createRoaster, getRosterStaffData } from '../services/attendance.service';

import { StaffDataType } from '@/modules/staff/staff.types';
import { PoyaDayType } from '@/modules/calendar/calendar.types';


const EditAttendanceSheet: React.FC<EditAttendanceSheetProps> = ({ year, month, setYear, setMonth, roasterId, refreshMonths }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [staffMembers, setStaffMembers] = useState<StaffDataType[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ staffId: number, day: number } | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});
  const [monthDays, setMonthDays] = useState<PoyaDayType[]>([]);

  const fetchStaffMembers = async () => {
    try {
      const response = await getRosterStaffData(`${year}-${(month).toString().padStart(2, '0')}`);
      // if (response.success) {
      if (response.monthData.dates) {
        setStaffMembers(response.staffData);
        setMonthDays(response.monthData.dates);
      } else {
        toast.warn("Please create month");
      }
    } catch (error) {
      toast.error("Error fetching staff members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, [year, month]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1);

  console.log("month", daysInMonth);

  const handleSave = async () => {
    const rosters: AttendanceType[] = [];

    Object.entries(attendanceData).forEach(([staffId, dailyData]) => {
      Object.entries(dailyData).forEach(([day, option]) => {
        const shiftId = option === "Off" ? 0 : option === "A" ? 103 : 104;
        if (option !== "Off") {
          const date = `${year}-${month.toString().padStart(2, '0')}-${parseInt(day).toString().padStart(2, '0')}`;
          rosters.push({
            rosterId: roasterId,
            shiftId,
            staffId: parseInt(staffId),
            date,
          });
        } else {
          const date = `${year}-${month.toString().padStart(2, '0')}-${parseInt(day).toString().padStart(2, '0')}`;
          rosters.push({
            rosterId: roasterId,
            shiftId,
            staffId: parseInt(staffId),
            date,
          });
        }
      });
    });

    console.log("ros", rosters);

    try {
      const response = await createRoaster({ rosters });
      if (response.success) {
        toast.success("Roster saved successfully");

        fetchStaffMembers(); // to refresh table
        setAttendanceData({});
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to save roster");
      }

      setYear(null);
      setMonth(null);
      refreshMonths();
    } catch (error) {
      toast.error("Error saving roster");

      setYear(null);
      setMonth(null);
      refreshMonths();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", marginBottom: 2 }}>
        <Button variant='contained' onClick={handleSave}>
          Save
        </Button>
      </Box>
      {staffMembers.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <Typography variant="body1" color="textSecondary">No Roaster Available</Typography>
        </Box>
      ) : (
        <TableContainer
          sx={{
            maxWidth: '1000px',
            maxHeight: '600px',
            overflowX: 'auto',
            overflowY: 'auto',
            border: '1px solid #2884FF33',
            borderRadius: "5px"
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ border: '1px solid #2884ff33', fontWeight: 'bold', textAlign: 'center', backgroundColor: "#d9c0fb" }}>EMP ID</TableCell>
                <TableCell sx={{ border: '1px solid #2884ff33', fontWeight: 'bold', textAlign: 'center', backgroundColor: "#d9c0fb" }}>NAME</TableCell>
                {daysInMonth.map((day) => {
                  const fullDateStr = `${year}-${(month).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                  const isPoyaDay = monthDays?.find(d => d.date === fullDateStr)?.isHoliday;

                  return (
                    <TableCell
                      key={day}
                      sx={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        textAlign: 'end',
                        paddingX: '3px',
                        border: '1px solid #2884ff33',
                        backgroundColor: isPoyaDay ? "#ff764c" : "#d9c0fb",
                        color: isPoyaDay ? "#fff" : isPoyaDay ? 'red' : '#000',
                      }}
                    >
                      {`${day}-${new Date(year, month - 1).toLocaleString('en-US', { month: 'short' })}`}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {staffMembers.map((staff, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell sx={{ border: "1px solid #2884ff33", fontWeight: "bold", textAlign: "center" }}>
                      {staff.id}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #2884ff33", fontWeight: "bold", textAlign: "start" }}>
                      {staff.fullName || "Unknown"}
                    </TableCell>
                    {daysInMonth.map((day) => {
                      const fullDateStr = `${year}-${(month).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                      const isPoyaDay = monthDays?.find(d => d.date === fullDateStr)?.isHoliday;

                      return (
                        <TableCell
                          key={day}
                          align="center"
                          sx={{
                            border: "1px solid #2884ff33",
                            backgroundColor: isPoyaDay ? "#ff764c" : "#fff",
                            color: isPoyaDay ? "#fff" : isPoyaDay ? 'red' : '#000',
                            cursor: isPoyaDay ? "not-allowed" : "pointer",
                          }}
                          onClick={() => {
                            if (!isPoyaDay) {
                              setSelectedCell({ staffId: staff.id, day });
                            }
                          }}
                        >
                          {attendanceData[staff.id]?.[day] || ""}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <AttendanceOptionModal
        open={!!selectedCell}
        onClose={() => setSelectedCell(null)}
        onSave={(option) => {
          if (selectedCell) {
            const { staffId, day } = selectedCell;
            setAttendanceData((prev) => ({
              ...prev,
              [staffId]: {
                ...(prev[staffId] || {}),
                [day]: option,
              }
            }));
          }
        }}
      />
    </Box>
  );
};

export default EditAttendanceSheet;