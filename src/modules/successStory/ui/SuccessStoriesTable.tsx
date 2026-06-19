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
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  IconButton,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import { toast } from "react-toastify";

import { SuccessStoryDataType } from "../successStory.types";
import {
  getSuccessStories,
  publishSuccessStory,
  deleteSuccessStory,
} from "../services/successStory.service";

import { TableProps } from "@/modules/countries/countries.types";

const columns = [
  { label: "Image", key: "image", width: "50%", align: "center" as const },
  { label: "", key: "publish", align: "center" as const },
  { label: "", key: "delete", align: "center" as const },
];

const SuccessStoriesTable: React.FC<TableProps> = ({ reload }) => {
  const theme = useTheme();

  const [stories, setStories] = useState<SuccessStoryDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openPublishDialog, setOpenPublishDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStory, setSelectedStory] =
    useState<SuccessStoryDataType | null>(null);

  // ✅ Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalStories, setTotalStories] = useState(0);

  const fetchStoryData = async (currentPage = page + 1, limit = rowsPerPage) => {
    setIsLoading(true);
    try {
      const response = await getSuccessStories(currentPage, limit);
      if (response?.success) {
        setStories(response.successStories);
        setTotalStories(response.totalSuccessStories || response.successStories.length); // make sure API returns total
      } else {
        setStories([]);
        setTotalStories(0);
      }
    } catch {
      toast.error("Failed to load success stories");
      setStories([]);
      setTotalStories(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStoryData();
  }, [reload, page, rowsPerPage]);

  /* ---------------- PUBLISH ---------------- */
  const handlePublishConfirm = async () => {
    if (!selectedStory) return;

    try {
      const newStatus = !selectedStory.isPublish;
      const res = await publishSuccessStory(selectedStory.id, newStatus);

      if (res.success) {
        toast.success(
          `Success story ${newStatus ? "published" : "unpublished"}`
        );
        fetchStoryData();
      } else {
        toast.error(res.message || "Publish update failed");
      }
    } catch {
      toast.error("Error updating publish status");
    } finally {
      setOpenPublishDialog(false);
      setSelectedStory(null);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDeleteConfirm = async () => {
    if (!selectedStory) return;

    try {
      const res = await deleteSuccessStory(selectedStory.id);

      if (res.success) {
        toast.success("Success story deleted successfully");
        fetchStoryData();
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch {
      toast.error("Error deleting success story");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedStory(null);
    }
  };

  /* ---------------- RENDER ROWS ---------------- */
  const renderRows = () => {
    if (isLoading) {
      return Array.from({ length: rowsPerPage }).map((_, i) => (
        <TableRow key={i}>
          {columns.map((_, j) => (
            <TableCell key={j} align="center">
              <Skeleton variant="text" width="100%" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    if (!stories.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} align="center">
            No success stories found
          </TableCell>
        </TableRow>
      );
    }

    return stories.map((story, index) => (
      <TableRow
        key={story.id}
        sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
      >
        <TableCell align="center">
          {story.documentPath ? (
            <Image
              src={story.documentPath}
              alt={story.documentId || "success-story"}
              width={100}
              height={100}
              style={{ borderRadius: 6, objectFit: "cover" }}
            />
          ) : (
            <Typography variant="caption">No image</Typography>
          )}
        </TableCell>

        <TableCell align="center">
          <Button
            size="small"
            variant="contained"
            color={story.isPublish ? "error" : "primary"}
            onClick={() => {
              setSelectedStory(story);
              setOpenPublishDialog(true);
            }}
          >
            {story.isPublish ? "Unpublish" : "Publish"}
          </Button>
        </TableCell>

        <TableCell align="center">
          <IconButton
            color="error"
            onClick={() => {
              setSelectedStory(story);
              setOpenDeleteDialog(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  /* ---------------- HANDLE PAGINATION ---------------- */
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset page to 0 when rows per page changes
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
                  key={col.key}
                  align={col.align}
                  sx={{
                    backgroundColor: "#fff",
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

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalStories}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ mt: 1 }}
      />

      {/* Publish Dialog */}
      <Dialog
        open={openPublishDialog}
        onClose={() => setOpenPublishDialog(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          style: {
            borderRadius: 10,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Confirm {selectedStory?.isPublish ? "Unpublish" : "Publish"} success
          story
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to{" "}
            {selectedStory?.isPublish ? "Unpublish" : "Publish"} this success
            story?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ gap: 1 }}>
          <Button
            onClick={() => setOpenPublishDialog(false)}
            variant="outlined"
            sx={{ width: 120 }}
          >
            No
          </Button>
          <Button
            onClick={handlePublishConfirm}
            variant="contained"
            sx={{ width: 120 }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          style: {
            borderRadius: 10,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this success story?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ gap: 1 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{ width: 120 }}
          >
            No
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{ width: 120 }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuccessStoriesTable;
