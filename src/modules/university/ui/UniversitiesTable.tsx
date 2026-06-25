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
  Box,
  TablePagination,
  Skeleton,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import EditUniversityModal from "./EditUniversityModal";
import { getUniversityData } from "../services/university.services";
import { UniversityDataType } from "../university.types";

import { TableProps } from "@/modules/countries/countries.types";
import { getCookieUser } from "@/utils/cookie.util";
import { logActivity } from "@/utils/logActivity";


const UniversitiesTable: React.FC<TableProps> = ({ reload }) => {
  const [universities, setUniversities] = useState<UniversityDataType[]>([]);
  const [selectedUni, setSelectedUni] = useState<UniversityDataType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [openEditModal, setOpenEditModal] = useState(false);
  const user = getCookieUser()

  const fetchUniversityData = async (pramPage?: number) => {
    setIsLoading(true);
    try {
      const response = await getUniversityData(pramPage || page + 1, limit);

      if (response?.success) {
        setUniversities(response.universities || []);
        setTotalRows(response.totalUniversities || 0);
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

  const onPageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
    fetchUniversityData(newPage + 1);

    if (user) {
      logActivity({
        userId: user.id,
        action: "UNIVERSITIES_PAGE_CHANGE",
        path: "/modules/university/ui/UniversitiesTable",
        method: "CLIENT",
        meta: {
          page: newPage
        }
      });
    }
  };

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(0);

    if (user) {
      logActivity({
        userId: user.id,
        action: "UNIVERSITIES_LIMIT_CHANGE",
        path: "/modules/university/ui/UniversitiesTable",
        method: "CLIENT",
        meta: {
          limit: e.target.value
        }
      });
    };
  }

  const handleEditClick = (uni: UniversityDataType) => {
    setSelectedUni(uni);
    setOpenEditModal(true);

    logActivity({
      userId: user ? user.id : 0,
      action: "EDIT_UNIVERSITY_CLICK",
      path: "/modules/university/ui/UniversitiesTable",
      method: "CLIENT",
      meta: { uniId: uni.id },
    });
  };

  const handleCloseModal = () => {
    setOpenEditModal(false);
    setSelectedUni(null);
  };

  const columns = [
    { label: "University Name", key: "name", width: "20%", align: "left" as const },
    { label: "Email", key: "email", width: "15%", align: "left" as const },
    { label: "Address", key: "address", width: "30%", align: "left" as const },
    { label: "Website", key: "website", width: "10%", align: "left" as const },
    { label: "Phone", key: "phoneNumber", width: "10%", align: "left" as const },
    { label: "", key: "edit", width: "5%", align: "center" as const },
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

    if (!universities.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} align="center">
            No data available
          </TableCell>
        </TableRow>
      );
    }

    return universities.map((uni, index) => (
      <TableRow
        key={uni.id}
        sx={{
          backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
        }}
      >
        {columns.map((col) => {
          let value: any = "-";

          switch (col.key) {
            case "name":
              value = uni.name;
              break;

            case "email":
              value = uni.email;
              break;

            case "address":
              value = uni.address + ", " + uni.countryInfo?.title.EN;
              break;

            case "phoneNumber":
              value = uni.phoneNumber;
              break;

            case "website":
              value = uni.website || "-";
              break;

            case "edit":
              return (
                <TableCell key={col.key} align={col.align}>
                  {user && user.roll === 1 && (
                    <IconButton onClick={() => handleEditClick(uni)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              );

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
      <Box>
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
      </Box>

      {openEditModal && selectedUni && (
        <EditUniversityModal
          isOpen={openEditModal}
          onClose={handleCloseModal}
          initialValues={selectedUni}
          reloadData={fetchUniversityData}
        />
      )}
    </>
  );
};

export default UniversitiesTable