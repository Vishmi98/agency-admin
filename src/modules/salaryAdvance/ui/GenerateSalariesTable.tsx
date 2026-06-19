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
  Button,
  Skeleton,
} from '@mui/material';

import ConfirmGenerateModal from './ConfirmGenerateModal';

import { GenerateSalariesTableProps } from '@/modules/staff/staff.types';


const columns = [
  { label: "ID", key: "id", width: "10%", align: "center" as const },
  { label: "Name", key: "fullName", width: "30%", align: "left" as const },
  { label: "Role", key: "role", width: "10%", align: "left" as const },
  { label: "Basic Salary (LKR)", key: "basicSalary", width: "22%", align: "right" as const },
  { label: "Commission Amount (LKR)", key: "commissionAmount", width: "23%", align: "right" as const },
];

const GenerateSalariesTable: React.FC<GenerateSalariesTableProps> = ({
  totalRows,
  staffs,
  isLoading,
  page,
  limit,
  onPageChange,
  onRowsPerPageChange,
  reloadData,
  selectedMonth
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingStaffId, setLoadingStaffId] = useState<number | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [generatedStaffIds, setGeneratedStaffIds] = useState<number[]>([]);

  const handleOpenModal = (staffId: number) => {
    setSelectedStaffId(staffId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStaffId(null);
  };

  const renderRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {columns.map(col => (
            <TableCell key={col.key} align={col.align}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
          <TableCell align="center">
            <Skeleton variant="text" width="100%" />
          </TableCell>
        </TableRow>
      ));
    }

    if (!staffs.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length + 1} align="center">
            No data available
          </TableCell>
        </TableRow>
      );
    }

    return staffs.map((member, index) => {
      const fullName = `${member.titleInfo?.title.EN || ""} ${member.firstName} ${member.lastName}`;
      const roleMap: Record<number, string> = {
        1: "Admin",
        2: "Consultant",
        3: "HR",
        4: "Accounts",
        5: "CEO",
        6: "Marketing Manager",
        7: "Branch Manager",
        8: "Operation Manager",
        9: "Coordinator",
      };
      const role = roleMap[member.roll] || "";

      return (
        <React.Fragment key={member.id}>
          <TableRow
            sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
          >
            <TableCell align="center">{member.id}</TableCell>
            <TableCell align="left" sx={{ textTransform: "capitalize" }}>{fullName}</TableCell>
            <TableCell align="left">{role}</TableCell>
            <TableCell align="right">{member.basicSalary.toLocaleString()}</TableCell>
            <TableCell align="right">{member.commissionAmount.toLocaleString()}</TableCell>
            <TableCell align="center" sx={{ display: "flex", gap: 1 }}>
              <Button
                sx={{ fontSize: "10px" }}
                size="small"
                variant="contained"
                onClick={() => handleOpenModal(member.id)}
                disabled={
                  !member.isActive ||
                  loadingStaffId === member.id ||
                  generatedStaffIds.includes(member.id)
                }
              >
                {loadingStaffId === member.id
                  ? "Generating..."
                  : generatedStaffIds.includes(member.id)
                    ? "Generated"
                    : "Generate"}
              </Button>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    });
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
            "& th": { fontWeight: "bold", fontSize: "12px", borderBottom: "1px solid #ddd", py: 1 },
            "& td": { fontSize: "12px", py: 1 },
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell
                  key={col.key}
                  align={col.align}
                  sx={{
                    fontWeight: "bold",
                    fontSize: 12,
                    backgroundColor: "#fff",
                    borderBottom: "1px solid #ddd",
                    width: col.width,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: 12, backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}
              >
              </TableCell>
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
        onRowsPerPageChange={e => onRowsPerPageChange(parseInt(e.target.value, 10))}
      />

      {isModalOpen && selectedStaffId !== null && (
        <ConfirmGenerateModal
          open={isModalOpen}
          onClose={handleCloseModal}
          staffId={selectedStaffId}
          month={selectedMonth}
          onSuccess={generatedId => {
            setGeneratedStaffIds(prev => [...prev, generatedId]);
            reloadData();
          }}
        />
      )}
    </Box>
  );
};

export default GenerateSalariesTable;