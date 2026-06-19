"use client";

import React, { useState } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { FilterUniversityTableProps } from '../university.types';


const FilterUniversitiesTable: React.FC<FilterUniversityTableProps> = ({
  totalRows,
  universities,
  isLoading,
  page,
  limit,
  onPageChange,
  onRowsPerPageChange,
}) => {
  
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleExpandClick = (index: number) => {
    setExpandedRow(prev => (prev === index ? null : index));
  };

  return (
    <Box>
      {isLoading ? (
        <Typography data-testid='loading' variant="body1" align="center">
          Loading...
        </Typography>
      ) : universities.length === 0 ? (
        <Typography data-testid='no-data' variant="body1" align="center">
          No data available
        </Typography>
      ) : (
        <>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              overflowX: 'auto',
              border: '1px solid #ddd',
              borderRadius: '10px',
            }}
          >
            <Table
              sx={{
                minWidth: 700,
                borderCollapse: 'collapse',
                '& th': {
                  fontWeight: 'bold',
                  fontSize: '12px',
                  borderBottom: '1px solid #ddd',
                },
                '& tr': {
                  borderBottom: '1px solid #ccc',
                },
                '& tbody > tr:last-child': {
                  borderBottom: 'none',
                },
                '& td': {
                  fontSize: '13px',
                },
              }}
              aria-label="universities table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px" }}>University Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "12px" }}>Code</TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px" }}>Email</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "12px" }}>Phone Number</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "12px" }}>Country</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "12px" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {universities.map((university, index) => (
                  <React.Fragment key={university.id}>
                    <TableRow>
                      <TableCell>{university.name}</TableCell>
                      <TableCell align="center">{university.code}</TableCell>
                      <TableCell align="left">{university.email}</TableCell>
                      <TableCell align="center">{university.phoneNumber}</TableCell>
                      <TableCell align="center">{university.countryInfo?.title.EN}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          data-testid='expanded-button'
                          onClick={() => handleExpandClick(index)}
                          aria-expanded={expandedRow === index}
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    {expandedRow === index && (
                      <TableRow>
                        <TableCell colSpan={7} style={{ paddingBottom: 0, paddingTop: 0 }}>
                          <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                            <Box margin={2} sx={{ bgcolor: '#edeef0', padding: 1, borderRadius: 2 }}>
                              <Stack flexDirection={'row'}>
                                <Typography variant="body2" fontWeight="bold">
                                  Address:
                                </Typography>
                                <Typography variant="body2" >{`  `}{university?.address}</Typography>
                              </Stack>
                              <Stack flexDirection={'row'}>
                                <Typography variant="body2" fontWeight="bold">
                                  Rank:
                                </Typography>
                                <Typography variant="body2" >{`  `}{university?.rank}</Typography>
                              </Stack>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={totalRows}
            rowsPerPage={limit}
            page={page}
            onPageChange={(e, newPage) => { onPageChange(newPage) }}
            onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
          />
        </>
      )}
    </Box>
  );
};

export default FilterUniversitiesTable;
