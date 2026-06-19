import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { AttendanceSheetProps, RoasterDataType } from '../attendance.types';


const AttendanceSheet: React.FC<AttendanceSheetProps> = ({
  year,
  month,
  roasterData,
  holiDays,
}) => {

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1);

  const staffGrouped = roasterData.reduce<Record<number, RoasterDataType[]>>((acc, item) => {
    if (!acc[item.staffId]) {
      acc[item.staffId] = [];
    }
    acc[item.staffId].push(item);
    return acc;
  }, {});

  return (
    <Box>
      <TableContainer
        sx={{
          maxWidth: '960px',
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
                const fullDateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const isHoliday = holiDays.find(d => d.date === fullDateStr)?.isHoliday;

                return (
                  <TableCell
                    key={day}
                    sx={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      textAlign: 'end',
                      paddingX: '3px',
                      border: '1px solid #2884ff33',
                      backgroundColor: isHoliday ? "#ff764c" : "#d9c0fb",
                      color: isHoliday ? "#fff" : '#000',
                    }}
                  >
                    {`${day}-${new Date(year, month - 1).toLocaleString('en-US', { month: 'short' })}`}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(staffGrouped).map(([staffId, entries]) => {
              const staffInfo = entries[0].staffInfo.find(info => info.id === Number(staffId));
              return (
                <TableRow key={staffId}>
                  <TableCell sx={{ border: "1px solid #2884ff33", fontWeight: "bold", textAlign: "center" }}>
                    {staffId}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #2884ff33", fontWeight: "bold", textAlign: "start" }}>
                    {staffInfo?.fullName || "Unknown"}
                  </TableCell>
                  {daysInMonth.map((day) => {
                    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const entry = entries.find(e => e.date === dateStr);
                    const isHoliday = holiDays.find(d => d.date === dateStr)?.isHoliday;

                    const shiftLabel = entry?.shiftId === 103 ? "A" : entry?.shiftId === 104 ? "B" : "";
                    let backgroundColor = "#fff";
                    if (entry) {
                      if (entry.shiftId === 0) {
                        backgroundColor = "#70cf97";
                      } else {
                        backgroundColor = "#fff";
                      }
                    }

                    return (
                      <TableCell
                        key={day}
                        align="center"
                        sx={{
                          border: "1px solid #2884ff33",
                          backgroundColor: isHoliday ? "#ff764c" : backgroundColor,
                          color: isHoliday ? "#fff" : '#000',
                        }}
                      >
                        {shiftLabel}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceSheet;
