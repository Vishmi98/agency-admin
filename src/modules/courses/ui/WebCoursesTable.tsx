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
  IconButton,
  Collapse,
  Box,
  Typography,
  Stack,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';

import { WebCourseDataType } from '../courses.types';
import { getWebCoursesData, publishWebCourse } from '../services/courses.service';

import { TableProps } from '@/modules/countries/countries.types';


const columns = [
  { label: "Course Name", key: "courseName", width: "25%", align: "left" as const },
  { label: "University", key: "university", width: "20%", align: "left" as const },
  { label: "Location", key: "location", width: "20%", align: "left" as const },
  { label: "Study Type", key: "studyType", width: "15%", align: "left" as const },
  { label: "Qualification", key: "qualification", width: "15%", align: "left" as const },
];

const WebCoursesTable: React.FC<TableProps> = ({ reload }) => {
  const theme = useTheme();

  const [courses, setCourses] = useState<WebCourseDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const page = 0;
  const limit = 5;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<WebCourseDataType | null>(null);

  const fetchCoursesData = async (pramPage?: number) => {
    setIsLoading(true);
    try {
      const response = await getWebCoursesData(pramPage || (page) + 1, limit);
      if (response?.success) {
        setCourses(response.courses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (course: WebCourseDataType) => {
    setSelectedCourse(course);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourse(null);
  };

  const handleConfirmPublish = async () => {
    if (!selectedCourse) return;
    try {
      const newPublishStatus = !selectedCourse.isPublish;
      const response = await publishWebCourse(selectedCourse.id, newPublishStatus);

      if (response.success) {
        toast.success(response.message || `Course ${newPublishStatus ? 'published' : 'unpublished'} successfully`);
        fetchCoursesData(); // Refresh
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
    fetchCoursesData();
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
            <Skeleton variant="circular" width={20} height={20} />
          </TableCell>
          <TableCell align="center">
            <Skeleton variant="circular" width={20} height={20} />
          </TableCell>
        </TableRow>
      ));
    }

    if (!courses.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length + 2} align="center">
            No data available
          </TableCell>
        </TableRow>
      );
    }

    return courses.map((course, index) => (
      <React.Fragment key={course.id}>
        <TableRow sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
          <TableCell align="left">{course.courseName}</TableCell>
          <TableCell align="left">{course.uniInfo?.name}</TableCell>
          <TableCell align="left">{course.uniInfo?.city}, {course.uniInfo?.countryInfo.country}</TableCell>
          <TableCell align="left">{course.studyTypeInfo?.title.EN}</TableCell>
          <TableCell align="left">{course.qualificationInfo?.title.EN}</TableCell>
          <TableCell align="center">
            <Button
              size="small"
              variant="contained"
              onClick={() => handleOpenDialog(course)}
              sx={{
                backgroundColor: course.isPublish ? "#d32f2f" : "#1976d2",
                "&:hover": { backgroundColor: course.isPublish ? "#b71c1c" : "#115293" },
                fontSize: "12px",
              }}
            >
              {course.isPublish ? "Unpublish" : "Publish"}
            </Button>
          </TableCell>
          <TableCell align="center">
            <IconButton onClick={() => handleExpandClick(index)}>
              <ExpandMoreIcon sx={{ transform: expandedRow === index ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }} />
            </IconButton>
          </TableCell>
        </TableRow>

        {expandedRow === index && (
          <TableRow>
            <TableCell colSpan={columns.length + 2} style={{ paddingBottom: 0, paddingTop: 0 }}>
              <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                <Box margin={2} sx={{ bgcolor: "#edeef0", padding: 2, borderRadius: 2 }}>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2" fontWeight="bold">
                      Rank:
                    </Typography>
                    <Typography variant="body2">{course.rank}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2" fontWeight="bold">
                      Next Intake:
                    </Typography>
                    <Typography variant="body2">{course.nextIntake}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2" fontWeight="bold">
                      Entry Score:
                    </Typography>
                    <Typography variant="body2">{course.entryScore}</Typography>
                  </Stack>
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
      <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 370, overflowY: "auto", borderRadius: "5px" }}>
        <Table stickyHeader sx={{ minWidth: 700, borderCollapse: "collapse", "& th": { fontWeight: "bold", fontSize: "12px", borderBottom: "1px solid #ddd" }, "& td": { fontSize: "12px" } }}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align} sx={{ backgroundColor: "#fff", borderBottom: "1px solid #ddd", width: col.width }}>
                  {col.label}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ backgroundColor: "#fff", borderBottom: "1px solid #ddd" }} />
              <TableCell align="center" sx={{ backgroundColor: "#fff", borderBottom: "1px solid #ddd" }} />
            </TableRow>
          </TableHead>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs" PaperProps={{ style: { borderRadius: 10, backgroundColor: theme.palette.background.paper } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Confirm {selectedCourse?.isPublish ? "Unpublish" : "Publish"} Course
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedCourse?.isPublish ? "Unpublish" : "Publish"} this course?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ gap: 1 }}>
          <Button onClick={handleCloseDialog} variant="outlined" sx={{ width: 120 }}>
            No
          </Button>
          <Button onClick={handleConfirmPublish} variant="contained" sx={{ width: 120 }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WebCoursesTable;

