"use client"

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { CurrentWeekInvoices } from "./dashboard.types";
import { getThisWeekInvoices } from "./services/dashboard.services";

import DashboardCard from "@/components/shared/DashboardCard";


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ProfitExpenses = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.error.main;

  const optionsColumnChart: any = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
      },
      height: 370,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "42%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },

    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 1,
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };


  const [seriesColumnChart, setSeriesColumnChart] = useState<CurrentWeekInvoices[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAttendanceMarkData = async () => {
    try {
      setIsLoading(true);
      const response = await getThisWeekInvoices();
      if (response?.success) {
        setSeriesColumnChart(response.chartData);
      }
    } catch (error) {
      console.log('Error fetching attendance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceMarkData();
  }, []);


  const ReloadButton = () => {
    return <Stack onClick={fetchAttendanceMarkData} sx={{ cursor: 'pointer' }}>Reload</Stack>
  }

  return (
    <>
      {!isLoading && seriesColumnChart?.length > 0 && <DashboardCard
        title="This week invoices"
        action={<ReloadButton />}
      >
        <Box className="rounded-bars">
          <Chart
            options={optionsColumnChart}
            series={seriesColumnChart}
            type="bar"
            width={"100%"}
            height="370px"
          />
        </Box>
      </DashboardCard>}
    </>
  );
};

export default ProfitExpenses;
