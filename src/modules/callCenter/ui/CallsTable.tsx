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
  TablePagination,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Skeleton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { CallCenterCallDataType } from '../callCenter.types'
import { getCallsData, submitResponse } from '../services/callCenter.service';
;
import { TableProps } from '@/modules/countries/countries.types';
import { getCookieUser } from '@/utils/cookie.util';


const columns = [
  { label: "Name", key: "name", width: "20%", align: "left" as const },
  { label: "Phone Number", key: "phone", width: "15%", align: "left" as const },
  { label: "Created By", key: "createBy", width: "15%", align: "left" as const },
  { label: "Checked By", key: "checkBy", width: "15%", align: "left" as const },
  { label: "Response", key: "response", width: "20%", align: "left" as const },
  { label: "Actions", key: "actions", width: "15%", align: "center" as const },
];

const CallsTable: React.FC<TableProps> = ({ reload }) => {
  const [calls, setCalls] = useState<CallCenterCallDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = getCookieUser();

  const fetchCallsData = async (pramPage?: number) => {
    setIsLoading(true);
    try {
      const response = await getCallsData(pramPage || (page) + 1, limit);
      if (response?.success) {
        setCalls(response.calls);
        setTotalRows(response.totalCalls);
      } else {
        setCalls([]);
      }
    } catch (error) {
      setCalls([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCallsData();
  }, [reload, limit]);

  const onPageChange = async (page_: number) => {
    setPage(page_)
    fetchCallsData(page_ + 1);
  }

  const onRowsPerPageChange = async (rows: number) => {
    setLimit(rows);
    setPage(0);
  }

  const handleExpandClick = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleOpenModal = (callId: number) => {
    setSelectedId(callId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const handleSubmitResponse = async () => {
    if (!selectedId || !responseText.trim()) return;

    try {
      setIsSubmitting(true);

      const response = await submitResponse(
        selectedId,
        responseText.trim(),
        user && user.id ? Number(user.id) : 0
      );

      if (response?.success) {
        await fetchCallsData(page + 1); // refresh current page
        handleCloseModal(); // close modal
        setResponseText(''); // reset input
      } else {
        setResponseText('');
      }
    } catch (error) {
      console.log(error);
      setResponseText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {columns.map((col) => (
            <TableCell key={col.key} align={col.align}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    if (!calls.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} align="center">
            No data available
          </TableCell>
        </TableRow>
      );
    }

    return calls.map((call, index) => (
      <React.Fragment key={call.id}>
        <TableRow sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
          <TableCell align="left">{call.name}</TableCell>
          <TableCell align="left">{call.phone}</TableCell>
          <TableCell align="left">{call.creatorInfo ? `${call.creatorInfo.firstName} ${call.creatorInfo.lastName}` : "_"}</TableCell>
          <TableCell align="left">{call.checkerInfo ? `${call.checkerInfo.firstName} ${call.checkerInfo.lastName}` : "_"}</TableCell>
          <TableCell align="left">
            {call.response ? (
              <Typography sx={{ display: '-webkit-box', WebkitLineClamp: 2, overflow: 'hidden' }}>
                {call.response}
              </Typography>
            ) : (
              <Button size="small" variant="contained" onClick={() => handleOpenModal(call.id)}>
                Response
              </Button>
            )}
          </TableCell>
          <TableCell align="center">
            <IconButton onClick={() => handleExpandClick(index)} aria-expanded={expandedRow === index}>
              <ExpandMoreIcon />
            </IconButton>
          </TableCell>
        </TableRow>
        {expandedRow === index && (
          <TableRow>
            <TableCell colSpan={columns.length} style={{ paddingBottom: 0, paddingTop: 0 }}>
              <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                <Box margin={2} sx={{ bgcolor: '#edeef0', p: 1, borderRadius: 2 }}>
                  {["from", "note", "qualification", "successPercentage", "response"].map((field) => (
                    <Stack flexDirection="row" key={field}>
                      <Typography variant="body2" fontWeight="bold">{`${field.charAt(0).toUpperCase() + field.slice(1)}:`}</Typography>
                      <Typography variant="body2">{`  ${call[field as keyof CallCenterCallDataType] ?? "-"}`}</Typography>
                    </Stack>
                  ))}
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
                <TableCell key={col.key} align={col.align} sx={{ fontWeight: "bold", fontSize: 12, backgroundColor: "#fff", borderBottom: "1px solid #ddd", width: col.width }}>
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
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
      />

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="xs" PaperProps={{ style: { borderRadius: 10, boxShadow: "0px 4px 20px rgba(0,0,0,0.1)" } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Response</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Type response here..."
          />
        </DialogContent>
        <DialogActions sx={{ gap: 1 }}>
          <Button onClick={handleCloseModal} variant="outlined" sx={{ width: 120 }}>Cancel</Button>
          <Button onClick={handleSubmitResponse} variant="contained" sx={{ width: 120 }}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CallsTable;

