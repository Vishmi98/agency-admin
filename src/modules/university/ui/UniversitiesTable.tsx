"use client";

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Box,
  TablePagination,
  Skeleton,
} from '@mui/material';

import { getUniversityData } from '../services/university.services';
import { UniversityDataType } from '../university.types';

import { TableProps } from '@/modules/countries/countries.types';


const UniversitiesTable: React.FC<TableProps> = ({ reload }) => {
  const [universities, setUniversities] = useState<UniversityDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const fetchUniversityData = async (pramPage?: number) => {
    setIsLoading(true);
    try {
      const response = await getUniversityData(pramPage || (page) + 1, limit);
      if (response?.success) {
        setUniversities(response.universities);
        setTotalRows(response.totalUniversities);
      } else {
        setUniversities([]);
      }
    } catch (error) {
      setUniversities([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversityData();
  }, [reload, limit]);

  const onPageChange = async (page_: number) => {
    setPage(page_)
    fetchUniversityData(page_ + 1);
  }

  const onRowsPerPageChange = async (rows: number) => {
    setLimit(rows);
    setPage(0);
  }

  const columns = [
    { label: "University Name", key: "name", width: "20%", align: "left" as const },
    { label: "Code", key: "code", width: "10%", align: "center" as const },
    { label: "Rank", key: "rank", width: "10%", align: "center" as const },
    { label: "Email", key: "email", width: "15%", align: "left" as const },
    { label: "Address", key: "address", width: "25%", align: "left" as const },
    { label: "Country", key: "countryInfo", width: "10%", align: "left" as const },
    { label: "Phone Number", key: "phoneNumber", width: "10%", align: "left" as const },
  ];

  const renderRows = () => {
    if (isLoading) {
      return Array.from({ length: limit }).map((_, i) => (
        <TableRow key={i}>
          {columns.map((col) => (
            <TableCell key={col.key} align={col.align}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    if (!universities.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length + 1} align="center">
            No data available
          </TableCell>
        </TableRow>
      );
    }

    return universities.map((uni, index) => (
      <React.Fragment key={uni.id}>
        <TableRow sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
          {columns.map((col) => (
            <TableCell key={col.key} align={col.align}>
              {(() => {
                const value = uni[col.key as keyof UniversityDataType];
                if (!value) return "";
                if (typeof value === "object" && "title" in value && value.title.EN) {
                  return value.title.EN;
                }
                if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                  return value.toString();
                }
                return "";
              })()}
            </TableCell>
          ))}
        </TableRow>
      </React.Fragment>
    ));
  };

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ maxHeight: 370, overflowY: "auto", borderRadius: "5px" }}
      >
        <Table
          stickyHeader
          sx={{
            minWidth: 700,
            borderCollapse: "collapse",
            "& th": {
              fontWeight: "bold",
              fontSize: 12,
              borderBottom: "1px solid #ddd",
              py: 1,
              backgroundColor: "#fff",
            },
            "& td": { fontSize: 12, py: 1 },
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align} sx={{ width: col.width }}>
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
        onPageChange={(e, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
      />
    </Box>
  );
};

export default UniversitiesTable;