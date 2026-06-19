"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TablePagination,
  TableCell,
  IconButton,
  Skeleton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import AddBasicSalaryModal from './AddBasicSalaryModal';
import { TableProps } from '../salary.types';

import { StaffDataType } from '@/modules/staff/staff.types';
import { TableColumnType } from '@/type/common.types';


const columns: TableColumnType[] = [
  { label: "Staff ID", width: "15%", align: "left" as const },
  { label: "Name", width: "25%", align: "left" as const },
  { label: "Role", width: "25%", align: "left" as const },
  { label: "Basic Salary", width: "20%", align: "right" as const },
  { label: "Action", width: "15%", align: "center" as const },
];

const AddBasicSalaryTable: React.FC<TableProps> = ({
  totalRows,
  staffs,
  isLoading,
  page,
  limit,
  onPageChange,
  onRowsPerPageChange,
  selectedStaff,
  setSelectedStaff,
  reloadData
}) => {
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleEditClick = (staff: StaffDataType) => {
    setSelectedStaff(staff);
    setOpenEditModal(true);
    console.log("id", selectedStaff);

  };

  const renderRows = () => {
    if (isLoading) {
      return Array.from({ length: limit }).map((_, i) => (
        <TableRow key={i}>
          {columns.map((col) => (
            <TableCell key={col.label} sx={{ width: col.width }}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    if (!staffs.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} align="center">
            No data available
          </TableCell>
        </TableRow>
      );
    }

    return staffs.map((member, index) => (
      <TableRow
        key={member.id}
        sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
      >
        <TableCell>{member.id}</TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {member.titleInfo?.title.EN} {member.firstName} {member.lastName}
        </TableCell>
        <TableCell>
          {(() => {
            switch (member.roll) {
              case 1:
                return "Admin";
              case 2:
                return "Consultant";
              case 3:
                return "HR";
              case 4:
                return "Accounts";
              case 5:
                return "CEO";
              case 6:
                return "Marketing Manager";
              case 7:
                return "Branch Manager";
              case 8:
                return "Operation Manager";
              case 9:
                return "Coordinator";
              case 10:
                return 'Junior Consultant';
              default:
                return "";
            }
          })()}
        </TableCell>
        <TableCell align="right">{member.basicSalary}</TableCell>
        <TableCell align="center">
          <IconButton onClick={() => handleEditClick(member)} aria-label="edit">
            <EditIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          maxHeight: 400,
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
              backgroundColor: "#fff",
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
                  key={col.label}
                  align={col.align}
                  sx={{
                    fontWeight: "bold",
                    width: col.width,
                    backgroundColor: "#fff",
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
        onPageChange={(e, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) =>
          onRowsPerPageChange(parseInt(e.target.value, 10))
        }
      />

      {openEditModal && selectedStaff && (
        <AddBasicSalaryModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          initialValues={selectedStaff}
          reloadData={reloadData}
        />
      )}
    </Box>
  );
};

export default AddBasicSalaryTable;