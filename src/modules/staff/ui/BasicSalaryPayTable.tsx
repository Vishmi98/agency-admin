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
  Typography,
  TablePagination,
  TableCell,
  Dialog,
  useTheme,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  Skeleton,
} from '@mui/material';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';

import { StaffDataType, StaffTableProps } from '../staff.types';
import { updateBasicSalaryPayStatus } from '../services/staff.services';

import { TableColumnType } from '@/type/common.types';


const columns: TableColumnType[] = [
  { label: "ID", width: "10%", align: "center" as const },
  { label: "Name", width: "20%", align: "left" as const },
  { label: "Email Address", width: "20%", align: "left" as const },
  { label: "Role", width: "15%", align: "left" as const },
  { label: "NIC", width: "15%", align: "left" as const },
  { label: "Basic Salary Pay", width: "20%", align: "right" as const },
];

const BasicSalaryPayTable: React.FC<StaffTableProps> = ({
  totalRows,
  staffs,
  isLoading,
  page,
  limit,
  onPageChange,
  onRowsPerPageChange,
  reloadData
}) => {
  const theme = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingStaffId, setLoadingStaffId] = useState<number | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [selectedStaffStatus, setSelectedStaffStatus] = useState<boolean | null>(null);

  const handleUpdateStatus = async (staffId: number, currentValue: boolean) => {
    setLoadingStaffId(staffId);

    try {
      const response = await updateBasicSalaryPayStatus(staffId, !currentValue);

      if (response.success) {
        toast.success(response.success);
        reloadData();
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error("An error occurred while updating");
    } finally {
      setLoadingStaffId(null);
      setIsModalOpen(false);
    }
  };

  const handleOpenModal = (staffId: number, currentValue: boolean) => {
    setSelectedStaffId(staffId);
    setSelectedStaffStatus(currentValue);
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

    return staffs.map((member: StaffDataType, index: number) => (
      <TableRow
        key={member.id}
        sx={{
          backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
        }}
      >
        <TableCell align="center">{member.id}</TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {member.titleInfo?.title.EN} {member.firstName} {member.lastName}
        </TableCell>
        <TableCell>{member.email}</TableCell>
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
        <TableCell>{member.nic}</TableCell>
        <TableCell align="right">
          <Switch
            checked={member.isBasicSalaryPay}
            onChange={() => handleOpenModal(member.id, member.isBasicSalaryPay)}
            size="small"
            color="primary"
            disabled={loadingStaffId === member.id}
          />
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
                  key={col.label}
                  align={col.align}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    backgroundColor: "#fff",
                    top: 0,
                    zIndex: 2,
                    borderBottom: "1px solid #ddd",
                    width: col.width,
                    whiteSpace: "nowrap",
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

      {/* Confirmation Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          style: {
            borderRadius: "10px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <DialogTitle
            sx={{
              padding: "16px 24px",
              fontWeight: "bold",
              color: theme.palette.text.primary,
            }}
          >
            Confirm {selectedStaffStatus ? "Deactivation" : "Activation"}
          </DialogTitle>
          <CloseIcon
            sx={{ width: 15, height: 15, marginRight: 3, cursor: "pointer" }}
            onClick={handleCloseModal}
          />
        </Box>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedStaffStatus ? "deactivate" : "activate"} this staff member?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px", gap: "8px" }}>
          <Button
            onClick={handleCloseModal}
            sx={{
              backgroundColor: "#f5f5f5",
              color: "#555",
              borderRadius: "5px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#e0e0e0" },
              width: "200px",
            }}
          >
            No
          </Button>
          <Button
            onClick={() =>
              selectedStaffId !== null &&
              selectedStaffStatus !== null &&
              handleUpdateStatus(selectedStaffId, selectedStaffStatus)
            }
            variant="contained"
            disabled={loadingStaffId === selectedStaffId}
            sx={{
              backgroundColor: "#1976d2",
              borderRadius: "5px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#115293" },
              width: "200px",
            }}
          >
            {loadingStaffId === selectedStaffId ? "Processing..." : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BasicSalaryPayTable;