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
  Switch,
  Dialog,
  useTheme,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Skeleton,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';

import EditStaffModal from './EditStaffModal';
import { StaffDataType, StaffTableProps } from '../staff.types';
import { activeStaffMember, addStaffPassword } from '../services/staff.services';

import { TableColumnType } from '@/type/common.types';
import { getCookieUser } from '@/utils/cookie.util';
import { logActivity } from '@/utils/logActivity';


const columns: TableColumnType[] = [
  { label: "ID", width: "5%", align: "left" },
  { label: "Name", width: "20%", align: "left" },
  { label: "Email Address", width: "15%", align: "left" },
  { label: "Role", width: "20%", align: "left" },
  { label: "Address", width: "25%", align: "left" },
  { label: "", width: "5%", align: "center" },
  { label: "", width: "5%", align: "center" },
  { label: "", width: "5%", align: "right" },
];

const StaffTable: React.FC<StaffTableProps> = ({
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
  const theme = useTheme();
  const user = getCookieUser()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingStaffId, setLoadingStaffId] = useState<number | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [selectedStaffStatus, setSelectedStaffStatus] = useState<boolean | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  // 🔹 Password Modal
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateStatus = async (staffId: number, currentValue: boolean) => {
    setLoadingStaffId(staffId);

    try {
      const response = await activeStaffMember(staffId, !currentValue);

      if (response.success) {
        toast.success(response.success);

        logActivity({
          userId: user ? user.id : 0,
          action: "STAFF_STATUS_UPDATED",
          path: "/modules/staff/ui/StaffTable",
          method: "CLIENT",
          meta: { staffId, newValue: !currentValue },
        });

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

    logActivity({
      userId: user ? user.id : 0,
      action: "STAFF_STATUS_MODAL_OPEN",
      path: "/modules/staff/ui/StaffTable",
      method: "CLIENT",
      meta: { staffId, currentValue },
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStaffId(null);

    logActivity({
      userId: user ? user.id : 0,
      action: "STAFF_STATUS_MODAL_CLOSE",
      path: "/modules/staff/ui/StaffTable",
      method: "CLIENT"
    });
  };

  const handleEditClick = (staff: StaffDataType) => {
    setSelectedStaff(staff);
    setOpenEditModal(true);

    logActivity({
      userId: user ? user.id : 0,
      action: "EDIT_STAFF_CLICK",
      path: "/modules/staff/ui/StaffTable",
      method: "CLIENT",
      meta: { staffId: staff.id },
    });
  };

  // 🔹 Open Password Modal
  const handleOpenPasswordModal = (staffId: number) => {
    setSelectedStaffId(staffId);
    setPasswordInput("");
    setOpenPasswordModal(true);

    logActivity({
      userId: user ? user.id : 0,
      action: "STAFF_PASSWORD_MODAL_OPEN",
      path: "/modules/staff/ui/StaffTable",
      method: "CLIENT",
      meta: { staffId },
    });
  };

  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
    setSelectedStaffId(null);
    setPasswordInput("");

    logActivity({
      userId: user ? user.id : 0,
      action: "STAFF_PASSWORD_MODAL_CLOSE",
      path: "/modules/staff/ui/StaffTable",
      method: "CLIENT"
    });
  };

  const handleSubmitPassword = async () => {
    if (!passwordInput || passwordInput.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);

    try {
      if (selectedStaffId === null) return;

      const response = await addStaffPassword(selectedStaffId, passwordInput);

      if (response.success) {
        toast.success(response.message);

        logActivity({
          userId: user ? user.id : 0,
          action: "STAFF_PASSWORD_UPDATED",
          path: "/modules/staff/ui/StaffTable",
          method: "CLIENT",
          meta: { staffId: selectedStaffId },
        });

        handleClosePasswordModal();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
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
          backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff", // even vs odd row color
        }}
      >
        <TableCell align="left">{member.id}</TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {member.titleInfo?.title.EN} {member.firstName} {member.lastName}
        </TableCell>
        <TableCell>{member.email}</TableCell>
        <TableCell>
          {(() => {
            switch (member.roll) {
              case 1:
                return "Super Admin";
              case 2:
                return "SL Team";
              case 3:
                return "NZ Team";
              default:
                return "";
            }
          })()}
        </TableCell>
        <TableCell>{member.address}</TableCell>
        <TableCell>
          {user && user.roll === 1 && (
            <Button variant="outlined" size='small' sx={{ fontSize: "8px" }} onClick={() => handleOpenPasswordModal(member.id)}>
              Change password
            </Button>
          )}
        </TableCell>
        <TableCell>
          {user && user.roll === 1 && (
            <IconButton onClick={() => handleEditClick(member)}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </TableCell>
        <TableCell align="right">
          {user && user.roll === 1 && (
            <Switch
              checked={member.isActive}
              onChange={() => handleOpenModal(member.id, member.isActive)}
              size="small"
              color="primary"
            />
          )}
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
                  align={col.align || "left"}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    backgroundColor: "#fff",
                    top: 0,
                    zIndex: 2,
                    borderBottom: "1px solid #ddd",
                    width: col.width,
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
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <DialogTitle
            sx={{
              padding: "16px 24px",
              fontWeight: "bold",
              color: theme.palette.text.primary,
            }}
          >
            Confirm {selectedStaffStatus ? "Deactivation" : "Activation"}
          </DialogTitle>
          <CloseIcon sx={{ width: 15, height: 15, marginRight: 3, cursor: "pointer" }} onClick={handleCloseModal} />
        </Box>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedStaffStatus ? "deactivate" : "activate"} this staff member?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px", gap: "8px" }}>
          <Button
            onClick={handleCloseModal}
            color="secondary"
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
            color="primary"
            autoFocus
            type="submit"
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

      {/* Password Modal */}
      <Dialog
        open={openPasswordModal}
        onClose={handleClosePasswordModal}
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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <DialogTitle
            sx={{
              padding: "16px 24px",
              fontWeight: "bold",
              color: theme.palette.text.primary,
            }}
          >
            Change Password
          </DialogTitle>
          <CloseIcon sx={{ width: 15, height: 15, marginRight: 3, cursor: "pointer" }} onClick={handleCloseModal} />
        </Box>
        <DialogContent>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px", gap: "8px" }}>
          <Button
            onClick={handleClosePasswordModal}
            color="secondary"
            sx={{
              backgroundColor: "#f5f5f5",
              color: "#555",
              borderRadius: "5px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#e0e0e0" },
              width: "200px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitPassword}
            color="primary"
            autoFocus
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              borderRadius: "5px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#115293" },
              width: "200px",
            }}
            disabled={passwordLoading}
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      {openEditModal && selectedStaff && (
        <EditStaffModal
          isOpen={openEditModal}
          onClose={() => setOpenEditModal(false)}
          initialValues={selectedStaff}
          reloadData={reloadData}
        />
      )}
    </Box>
  );
};

export default StaffTable;