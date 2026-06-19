"use client"

import React from 'react'
import { Box, Card, CardContent, Typography, CircularProgress, Grid, TablePagination } from '@mui/material'

import { InvoiceTableProps } from '../invoice.types'


const PendingPaymentInvoices: React.FC<InvoiceTableProps> = ({
    totalRows,
    invoices,
    isLoading,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
}) => {

    return (
        <Box>
            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress />
                </Box>
            ) : invoices.length === 0 ? (
                <Typography data-testid='no-data' variant="body1" align="center">
                    No data available
                </Typography>
            ) : (
                <>
                    <Grid container spacing={2}>
                        {invoices.map((invoice) => (
                            <Grid item xs={12} sm={6} lg={4} key={invoice.id}>
                                <Card variant='outlined' sx={{ height: "100%", width: "100%" }}>
                                    <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", height: "100%", width: "100%", gap: 3 }}>
                                        <Typography variant="h6">
                                            INV- {invoice.id}
                                        </Typography>
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", height: "100%", width: "100%", gap: 1 }}>
                                            <Typography variant="body1">
                                                Student Name: {invoice.studentInfo?.titleInfo.title.EN} {invoice.studentInfo?.firstName} {invoice.studentInfo?.lastName}
                                            </Typography>
                                            <Typography variant="body1">
                                                Created By: {invoice.staffInfo?.firstName} {invoice.staffInfo?.lastName}({invoice.staffInfo?.id})
                                            </Typography>
                                            <Typography variant="body1">
                                                University & Package: {invoice.updatePackageId ? invoice.updatePackage.title : invoice.packageInfo?.title}
                                            </Typography>
                                            <Typography variant="body1">
                                                Total Amount: {invoice.totalPrice.toLocaleString()} {invoice.currency}
                                            </Typography>
                                            <Typography variant="body1">
                                                Due Amount: {invoice.dueAmount.toLocaleString()} {invoice.currency}
                                            </Typography>
                                            <Typography variant="body1">
                                                Invoice Date: {invoice.invoiceDate}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    backgroundColor: invoice.statusInfo.color,
                                                    color: "#fff",
                                                    fontSize: "10px",
                                                    fontWeight: "bold",
                                                    textTransform: "none",
                                                    borderRadius: "20px",
                                                    padding: "3px 8px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                {invoice.statusInfo.title.EN}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <TablePagination
                            component="div"
                            count={totalRows}
                            page={page}
                            onPageChange={(e, newPage) => onPageChange(newPage)}
                            rowsPerPage={limit}
                            onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
                            rowsPerPageOptions={[5, 10, 20]}
                        />
                    </Box>
                </>
            )}
        </Box>
    )
}

export default PendingPaymentInvoices
