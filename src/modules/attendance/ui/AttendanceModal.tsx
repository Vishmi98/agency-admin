import React from 'react';
import { Box, Modal, Typography, Button } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";

import { AttendanceOptionModalProps } from '../attendance.types';


const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

const AttendanceOptionModal: React.FC<AttendanceOptionModalProps> = ({ open, onClose, onSave }) => {
  
  const handleSelect = (option: "A" | "B" | "Off") => {
    onSave(option);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 2
          }}
        >
          <Typography variant="h6" mb={2}>Select Shift</Typography>
          <CloseIcon
            sx={{ width: 15, height: 15, cursor: "pointer" }}
            onClick={onClose}
          />
        </Box>
        <Box display="flex" justifyContent="center" gap={2}>
          {["A", "B", "Off"].map((opt) => (
            <Button key={opt} variant="outlined" fullWidth onClick={() => handleSelect(opt as "A" | "B" | "Off")}>
              {opt}
            </Button>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default AttendanceOptionModal;
