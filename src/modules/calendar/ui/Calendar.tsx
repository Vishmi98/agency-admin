"use client";

import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { toast } from "react-toastify";

import { createMonth } from "../services/calendar.service";


const Calendar = () => {
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
  const [workingDays, setWorkingDays] = useState<string>("");

  const handleDateChange = (date: Dayjs | null) => {
    if (!date) return;

    const alreadySelected = selectedDates.find((d) => d.isSame(date, "day"));
    if (alreadySelected) {
      setSelectedDates((prev) => prev.filter((d) => !d.isSame(date, "day")));
    } else {
      setSelectedDates((prev) => [...prev, date]);
    }
  };

  const handleSave = async () => {
    if (selectedDates.length === 0) {
      toast.error("Please select at least one date.");
      return;
    }

    const dates = selectedDates.map((date) => date.format("YYYY-MM-DD"));
    const month = selectedDates[0].format("YYYY-MM"); // use first selected date's month

    if (!workingDays || isNaN(Number(workingDays))) {
      toast.error("Please enter a valid number of working days.");
      return;
    }

    try {
      const response = await createMonth(dates, Number(workingDays), month);

      if (response.success) {
        toast.success("Month created!");
      } else {
        toast.error(`Error: ${response.message}`);
      }
    } catch (error) {
      toast.error("An error occurred while creating month");
    } finally {
      setSelectedDates([]);
      setWorkingDays("");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>

        <DateCalendar
          onChange={handleDateChange}
        />

        <Box>
          <Typography variant="body1">
            Selected Days: {selectedDates
              .sort((a, b) => a.unix() - b.unix())
              .map((d) => d.format("YYYY-MM-DD"))
              .join(", ")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", md: "40%" },
              marginY: 2,
            }}
          >
            <Typography variant="body1" sx={{ minWidth: "140px" }}>
              Work Days Count:
            </Typography>
            <TextField
              variant="outlined"
              margin="none"
              type="number"
              size="small"
              fullWidth
              value={workingDays}
              onChange={(e) => setWorkingDays(e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Box>

          <Button variant="contained" size="large" onClick={handleSave} sx={{ mt: 1 }}>
            Save
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Calendar;
