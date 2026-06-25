"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  Skeleton,
} from "@mui/material";

import { LogDataType } from "../logs.types";
import { getLogsData } from "../service/logs.service";

import { TableProps } from "@/modules/countries/countries.types";
import { getCookieUser } from "@/utils/cookie.util";
import { logActivity } from "@/utils/logActivity";


const LogsTable: React.FC<TableProps> = ({ reload }) => {
  const [logs, setLogs] = useState<LogDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const user = getCookieUser()

  const fetchLogsData = async (pramPage?: number) => {
    setIsLoading(true);
    try {
      const response = await getLogsData(pramPage || page + 1, limit);

      if (response?.success) {
        setLogs(response.logs || []);
        setTotalRows(response.totalLogs || 0);
      } else {
        setLogs([]);
      }
    } catch (error) {
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogsData();
  }, [reload, limit]);

  const onPageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
    fetchLogsData(newPage + 1);

    // if (user) {
    //   logActivity({
    //     userId: user.id,
    //     action: "LOGS_PAGE_CHANGE",
    //     path: "/modules/logs/ui/LogsTable",
    //     method: "CLIENT",
    //     meta: {
    //       page: newPage
    //     }
    //   });
    // }
  };

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(0);

    // if (user) {
    //   logActivity({
    //     userId: user.id,
    //     action: "LOGS_LIMIT_CHANGE",
    //     path: "/modules/logs/ui/LogsTable",
    //     method: "CLIENT",
    //     meta: {
    //       limit: e
    //     }
    //   });
    // }
  };

  const columns = [
    { label: "User Name", key: "name", width: "20%", align: "left" as const },
    { label: "Action", key: "action", width: "20%", align: "left" as const },
    { label: "Path", key: "path", width: "20%", align: "left" as const },
    { label: "End Point", key: "endpoint", width: "20%", align: "left" as const },
    { label: "Meta", key: "meta", width: "20%", align: "left" as const },
  ];

  const renderRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {columns.map((col) => (
            <TableCell key={col.key} align={col.align}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    if (!logs.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} align="center">
            No data available
          </TableCell>
        </TableRow>
      );
    }

    return logs.map((uni, index) => (
      <TableRow
        key={uni._id}
        sx={{
          backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
        }}
      >
        {columns.map((col) => {
          let value: any = "-";

          switch (col.key) {
            case "name":
              value = uni.userInfo.fullName;
              break;

            case "action":
              value = uni.action;
              break;

            case "path":
              value = uni.path;
              break;

            case "endpoint":
              value = uni.endpoint ? uni.endpoint : "_";
              break;

            case "meta":
              value = uni.meta ? JSON.stringify(uni.meta) : "-";
              break;

            default:
              value = "-";
          }

          return (
            <TableCell key={col.key} align={col.align}>
              {value}
            </TableCell>
          );
        })}
      </TableRow>
    ));
  };

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          maxHeight: 370,
          overflowY: "auto",
          borderRadius: "5px",
        }}
      >
        <Table
          stickyHeader
          sx={{
            minWidth: 700,
            borderCollapse: "collapse",
            "& th": {
              fontWeight: "bold",
              fontSize: "12px",
              borderBottom: "1px solid #ddd",
              py: 1,
            },
            "& td": {
              fontSize: "12px",
              py: 1,
            },
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align}
                  sx={{
                    width: col.width,
                    fontWeight: "bold",
                    fontSize: "12px",
                    backgroundColor: "#fff",
                    top: 0,
                    zIndex: 2,
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>{renderRows()}</TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={totalRows}
        rowsPerPage={limit}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
};

export default LogsTable;