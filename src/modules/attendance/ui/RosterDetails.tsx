import React, { FC, useState } from 'react'
import { Box, Button, Divider, Typography, useTheme } from '@mui/material';

import AttendanceOptionModal from './AttendanceModal';
import { RosterDetailsProps } from '../attendance.types';
import { editShift } from '../services/attendance.service';


const RosterDetails: FC<RosterDetailsProps> = ({ rosterData, onUpdated }) => {
    const theme = useTheme();

    const [modalOpen, setModalOpen] = useState(false);

    const handleSave = async (option: "A" | "B" | "Off") => {
        const shiftId = option === "Off" ? 0 : option === "A" ? 103 : 104;
        try {
            const response = await editShift(
                rosterData.rosterId,
                rosterData.date,
                rosterData.staffId,
                shiftId
            );
            if (response.success) {
                onUpdated(response); // Notify parent to update state
                window.location.reload();
            } else {
                console.log(response.message);
            }
        } catch (error) {
            console.log('Error updating shift:', error);
        }
    };

    if (!rosterData) return null;

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    padding: "10px",
                    borderRadius: "5px",
                    marginTop: { xs: 1, lg: 0 },
                    marginBottom: { xs: 2 }
                }}
            >
                <Typography variant="subtitle1">Roster Details</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography><strong>Roster ID:</strong> {rosterData.rosterId}</Typography>
                <Typography><strong>Date:</strong> {rosterData.date}</Typography>
                <Typography><strong>StaffId:</strong> {rosterData.staffId}</Typography>
                <Typography><strong>Staff:</strong> {rosterData.staffInfo[0]?.fullName}</Typography>
                <Typography>
                    <strong>Shift:</strong>{' '}
                    {rosterData.shiftId === 0
                        ? 'Off Day'
                        : `${rosterData.shiftInfo?.name} (${rosterData.shiftInfo?.startTime} - ${rosterData.shiftInfo?.endTime})`}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => setModalOpen(true)}
                >
                    Edit Shift
                </Button>
            </Box>

            <AttendanceOptionModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            />
        </>
    )
}

export default RosterDetails
