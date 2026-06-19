"use client"

import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import { TopSale } from "./dashboard.types";
import { getTopSale } from "./services/dashboard.services";

import DashboardCard from "@/components/shared/DashboardCard";


const TopPayingClients = () => {
  const [topSale, setTopSale] = useState<TopSale[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAttendanceMarkData = async () => {
    try {
      setIsLoading(true);
      const response = await getTopSale();
      if (response?.success) {
        setTopSale(response.topSale);
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

  return (<>
    {!isLoading && topSale?.length > 0 && <DashboardCard title="Top performance staff">
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <Table
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Number of Invoices
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topSale.map((staff) => (
                <TableRow key={staff.staffId}>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      {`${staff.firstName} ${staff.lastName}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      fontWeight={400}
                    >
                      {staff.invoiceCount}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </DashboardCard >}
  </>
  );
};

export default TopPayingClients;
