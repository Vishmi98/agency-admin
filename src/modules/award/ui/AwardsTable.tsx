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
import { Close } from "@mui/icons-material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from "@mui/icons-material/Close";

import { AwardDataType } from "../award.types";
import { addImages, deleteAward, deleteAwardImage, getAwards, publishAward } from "../award.service";

import { TableProps } from "@/modules/countries/countries.types";


const columns = [
  { label: "Year & Title", key: "year", width: "25%", align: "center" as const },
  { label: "Images", key: "image", width: "50%", align: "center" as const },
  { label: "Add Images", key: "image", width: "50%", align: "center" as const },
  { label: "", key: "publish", align: "center" as const },
  { label: "", key: "delete", align: "center" as const },
  { label: "", key: "delete", align: "center" as const },
];

const AwardsTable: React.FC<TableProps> = ({ reload }) => {
  const theme = useTheme();

  const [awards, setAwards] = useState<AwardDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openPublishDialog, setOpenPublishDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAward, setSelectedAward] =
    useState<AwardDataType | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [openDeleteImageDialog, setOpenDeleteImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    awardId: number;
    imageId: string;
  } | null>(null);

  // ✅ Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalAwards, setTotalAwards] = useState(0);

  const handleToggleRow = (id: number) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    // Only take the first file
    setSelectedFile(e.target.files[0]);
  };

  const fetchAwards = async (currentPage = page + 1, limit = rowsPerPage) => {
    setIsLoading(true);
    try {
      const response = await getAwards(currentPage, limit);
      if (response?.success) {
        setAwards(response.awards);
        setTotalAwards(response.totalAwards || response.awards.length); // make sure API returns total
      } else {
        setAwards([]);
        setTotalAwards(0);
      }
    } catch {
      toast.error("Failed to load success awards");
      setAwards([]);
      setTotalAwards(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, [reload, page, rowsPerPage]);

  /* ---------------- PUBLISH ---------------- */
  const handlePublishConfirm = async () => {
    if (!selectedAward) return;

    try {
      const newStatus = !selectedAward.isPublish;
      const res = await publishAward(selectedAward.id, newStatus);

      if (res.success) {
        toast.success(
          `Award ${newStatus ? "published" : "unpublished"}`
        );
        fetchAwards();
      } else {
        toast.error(res.message || "Publish update failed");
      }
    } catch {
      toast.error("Error updating publish status");
    } finally {
      setOpenPublishDialog(false);
      setSelectedAward(null);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDeleteConfirm = async () => {
    if (!selectedAward) return;

    try {
      const res = await deleteAward(selectedAward.id);

      if (res.success) {
        toast.success("Award deleted successfully");
        fetchAwards();
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch {
      toast.error("Error deleting success story");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedAward(null);
    }
  };

  const handleAddImages = async () => {
    if (!selectedAward || !selectedFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", selectedAward.id.toString());

      // Only ONE image
      formData.append("images", selectedFile);

      const res = await addImages(formData);

      if (res.success) {
        toast.success("Image added successfully");
        fetchAwards();
      } else {
        toast.error(res.message || "Failed to add image");
      }
    } catch {
      toast.error("Error uploading image");
    } finally {
      setOpenAddDialog(false);
      setSelectedFile(null);
      setSelectedAward(null);
    }
  };

  const handleDeleteImageConfirm = async () => {
    if (!selectedImage) return;

    try {
      const res = await deleteAwardImage(
        selectedImage.awardId,
        selectedImage.imageId
      );

      if (res.success) {
        toast.success("Image deleted");
        fetchAwards();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Error deleting image");
    } finally {
      setOpenDeleteImageDialog(false);
      setSelectedImage(null);
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

    if (!awards.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} align="center">
            No success awards found
          </TableCell>
        </TableRow>
      );
    }

    return awards.map((award, index) => (
      <React.Fragment key={award.id}>
        <TableRow
          key={award.id}
          sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}
        >
          {/* YEAR */}
          <TableCell align="center">{award.year} - {award.title}</TableCell>

          {/* IMAGES */}
          <TableCell align="center">
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {award.images?.length ? (
                award.images.slice(0, 3).map((img, i) => {
                  const originalIndex = award.images.indexOf(img);

                  return (
                    <Box key={i} sx={{ position: "relative" }}>
                      <Image
                        src={img}
                        alt="award"
                        width={80}
                        height={80}
                        style={{
                          borderRadius: 6,
                          objectFit: "cover",
                        }}
                      />

                      {/* DELETE BUTTON */}
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          background: "#fff",
                        }}
                        onClick={() => {
                          setSelectedImage({
                            awardId: award.id,
                            imageId: award.imageIds[originalIndex],
                          });
                          setOpenDeleteImageDialog(true);
                        }}
                      >
                        <Close sx={{ width: 15, height: 15 }} color="error" />
                      </IconButton>
                    </Box>
                  );
                })
              ) : (
                <Typography variant="caption">No images</Typography>
              )}
            </Box>
          </TableCell>
          <TableCell align="center">
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setSelectedAward(award);
                setOpenAddDialog(true);
              }}
            >
              Add
            </Button>
          </TableCell>

          <TableCell align="center">
            <Button
              size="small"
              variant="contained"
              color={award.isPublish ? "error" : "primary"}
              onClick={() => {
                setSelectedAward(award);
                setOpenPublishDialog(true);
              }}
            >
              {award.isPublish ? "Unpublish" : "Publish"}
            </Button>
          </TableCell>

          <TableCell align="center">
            <IconButton
              color="error"
              onClick={() => {
                setSelectedAward(award);
                setOpenDeleteDialog(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
          <TableCell align="center">
            <IconButton onClick={() => handleToggleRow(award.id)}>
              <ExpandMoreIcon
                fontSize="small"
                sx={{
                  transform: expandedRow === award.id ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.3s",
                }}
              />
            </IconButton>
          </TableCell>
        </TableRow>
        {/* EXPANDED ROW */}
        {expandedRow === award.id && (
          <TableRow>
            <TableCell colSpan={columns.length}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  py: 2,
                }}
              >
                {award.images?.length ? (
                  award.images.map((img, i) => (
                    <Box key={i} sx={{ position: "relative" }}>
                      <Image
                        src={img}
                        alt="award"
                        width={100}
                        height={100}
                        style={{
                          borderRadius: 8,
                          objectFit: "cover",
                        }}
                      />
                      {/* DELETE IMAGE */}
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          background: "#fff",
                        }}
                        onClick={() => {
                          setSelectedImage({
                            awardId: award.id,
                            imageId: award.imageIds[i],
                          });
                          setOpenDeleteImageDialog(true);
                        }}
                      >
                        <Close sx={{ width: 15, height: 15 }} color="error" />
                      </IconButton>
                    </Box>
                  ))
                ) : (
                  <Typography>No images</Typography>
                )}
              </Box>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
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
        count={totalAwards}
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
          Confirm {selectedAward?.isPublish ? "Unpublish" : "Publish"} award
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to{" "}
            {selectedAward?.isPublish ? "Unpublish" : "Publish"} this award?
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
            Are you sure you want to delete this award?
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

      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        fullWidth
        maxWidth="sm"
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
              position: "sticky",
              top: 0,
              zIndex: 1000,
              color: theme.palette.text.primary,
            }}
          >
            Add Images
          </DialogTitle>
          <CloseIcon data-testid="CloseIcon" sx={{ width: 15, height: 15, marginRight: 3 }} onClick={() => setOpenAddDialog(false)} />
        </Box>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />

            <Box display="flex" justifyContent="center">
              {selectedFile && (
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="preview"
                  width={150}
                  height={150}
                  style={{
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            padding: "16px 24px",
            gap: "8px",
            position: "sticky",
            bottom: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: 1000,
          }}
        >
          <Button
            onClick={() => setOpenAddDialog(false)}
            color="secondary"
            sx={{
              backgroundColor: "#f5f5f5",
              color: "#555",
              borderRadius: "5px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#e0e0e0" },
              width: "200px"
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddImages}
            sx={{
              backgroundColor: "#1976d2",
              borderRadius: "5px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#115293" },
              width: "200px"
            }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteImageDialog}
        onClose={() => setOpenDeleteImageDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Confirm Image Delete
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete this image?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ gap: 1 }}>
          <Button
            onClick={() => setOpenDeleteImageDialog(false)}
            variant="outlined"
            sx={{ width: 120 }}
          >
            No
          </Button>

          <Button
            onClick={handleDeleteImageConfirm}
            variant="contained"
            color="error"
            sx={{ width: 120 }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AwardsTable;
