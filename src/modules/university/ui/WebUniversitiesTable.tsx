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
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  IconButton,
  Collapse,
} from '@mui/material';
import Image from 'next/image';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';

import { WebUniversityDataType } from '../university.types';
import { getWebUniversities, publishWebUniversity } from '../services/university.services';

import { TableProps } from '@/modules/countries/countries.types';


const columns = [
  { label: "University Name", key: "name", width: "25%", align: "left" as const },
  { label: "Code", key: "code", width: "10%", align: "center" as const },
  { label: "Email", key: "email", width: "20%", align: "left" as const },
  { label: "Country", key: "country", width: "15%", align: "center" as const },
  { label: "Logo", key: "logo", width: "15%", align: "center" as const },
];

const WebUniversitiesTable: React.FC<TableProps> = ({ reload }) => {
  const theme = useTheme();

  const [universities, setUniversities] = useState<WebUniversityDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const page = 0;
  const limit = 5;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<WebUniversityDataType | null>(null);

  const fetchUniversityData = async (pramPage?: number) => {
    setIsLoading(true);
    try {
      const response = await getWebUniversities(pramPage || (page) + 1, limit);
      if (response?.success) {
        setUniversities(response.universities);
      } else {
        setUniversities([]);
      }
    } catch (error) {
      setUniversities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (university: WebUniversityDataType) => {
    setSelectedUniversity(university);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUniversity(null);
  };

  const handleConfirmPublish = async () => {
    if (!selectedUniversity) return;
    try {
      const newPublishStatus = !selectedUniversity.isPublish;
      const response = await publishWebUniversity(selectedUniversity.id, newPublishStatus);

      if (response.success) {
        toast.success(response.message || `University ${newPublishStatus ? 'published' : 'unpublished'} successfully`);
        fetchUniversityData(); // Refresh
      } else {
        toast.error(response.message || "Failed to update publish status");
      }
    } catch (error) {
      toast.error("An error occurred while updating");
    } finally {
      handleCloseDialog();
    }
  };

  useEffect(() => {
    fetchUniversityData();
  }, [reload, limit]);

  const handleExpandClick = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const renderRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {columns.map((col) => (
            <TableCell key={col.key} align={col.align}>
              <Skeleton variant="text" width="100%" />
            </TableCell>
          ))}
          <TableCell align="center">
            <Skeleton variant="text" width="100%" />
          </TableCell>
          <TableCell align="center">
            <Skeleton variant="circular" width={20} height={20} />
          </TableCell>
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
          <TableCell align="left">{uni.name}</TableCell>
          <TableCell align="center">{uni.code}</TableCell>
          <TableCell align="left">{uni.email}</TableCell>
          <TableCell align="center">{uni.countryInfo.country}</TableCell>
          <TableCell align="center">
            <Image src={uni.logo ?? ""} alt={uni.name} width={50} height={50} style={{ objectFit: "cover", borderRadius: 5 }} />
          </TableCell>
          <TableCell align="center">
            <Button
              size="small"
              variant="contained"
              onClick={() => handleOpenDialog(uni)}
              sx={{ backgroundColor: uni.isPublish ? "#d32f2f" : "#1976d2", "&:hover": { backgroundColor: uni.isPublish ? "#b71c1c" : "#115293" }, fontSize: "10px" }}
            >
              {uni.isPublish ? "Unpublish" : "Publish"}
            </Button>
          </TableCell>
          <TableCell align="center">
            <IconButton onClick={() => handleExpandClick(index)}>
              <ExpandMoreIcon sx={{ transform: expandedRow === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
            </IconButton>
          </TableCell>
        </TableRow>

        {expandedRow === index && (
          <TableRow>
            <TableCell colSpan={columns.length + 2} style={{ paddingBottom: 0, paddingTop: 0 }}>
              <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                <Box margin={2} sx={{ bgcolor: '#edeef0', padding: 2, borderRadius: 2 }}>
                  <Typography variant="body2"><strong>Address:</strong> {uni.address}</Typography>
                  <Typography variant="body2"><strong>Local Rank:</strong> {uni.localRanking}</Typography>
                  <Typography variant="body2"><strong>World Rank:</strong> {uni.worldRanking}</Typography>
                  <Box mt={1}>
                    <Typography variant="body2"><strong>Cover Image:</strong></Typography>
                    <Image src={uni.coverImage ?? ""} alt="" width={200} height={200} style={{ objectFit: "cover", borderRadius: 5 }} />
                  </Box>
                  <Box mt={1}>
                    <Typography variant="body2"><strong>Other Images:</strong></Typography>
                    <Box display="flex" gap={2}>
                      {uni.images?.map((img, idx) => (
                        <Image key={idx} src={img} alt={`image-${idx}`} width={100} height={100} style={{ objectFit: "cover", borderRadius: 5 }} />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
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
                <TableCell key={col.key} align={col.align} sx={{ backgroundColor: "#fff", borderBottom: "1px solid #ddd", width: col.width }}>
                  {col.label}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}>
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs" PaperProps={{ style: { borderRadius: 10, backgroundColor: theme.palette.background.paper } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Confirm {selectedUniversity?.isPublish ? "Unpublish" : "Publish"} University
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedUniversity?.isPublish ? "Unpublish" : "Publish"} this university?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ gap: 1 }}>
          <Button onClick={handleCloseDialog} variant="outlined" sx={{ width: 120 }}>No</Button>
          <Button onClick={handleConfirmPublish} variant="contained" sx={{ width: 120 }}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WebUniversitiesTable;
