"use client"

import React, { useRef } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Divider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

import { PaymentProp } from '../payment.types';


const Payment: React.FC<PaymentProp> = ({ payment, setIsModalOpen }) => {
    const paymentRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        const html2pdf = (await import("html2pdf.js")).default;
        const element = paymentRef.current;
        if (!element) return;

        const options = {
            margin: 0.5,
            filename: `receipt-${payment.id}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        html2pdf().set(options).from(element).save();
    };

    return (
        <>
            <Box>
                <Box sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    width: "100%",
                    marginBottom: 2,
                    gap: 2
                }}>
                    <CloseIcon
                        sx={{ width: 15, height: 15, cursor: "pointer" }}
                        onClick={() => setIsModalOpen(false)}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        width: "100%",
                        marginBottom: 2,
                        gap: 2,
                    }}
                    paddingRight={3}
                >
                    <Box sx={{ backgroundColor: "#f8f8f8", padding: 1, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <DownloadIcon sx={{ width: "16px", height: "16px", cursor: "pointer" }} onClick={handleDownloadPDF} />
                    </Box>
                </Box>
                {/* Invoice Content */}
                <Box ref={paymentRef} padding={3}>
                    {/* Header */}
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        width: "100%",
                        marginBottom: 3
                    }}>
                        <img
                            src="/logo1.jpeg"
                            alt="Real Smart Logo"
                            width={160}
                            height={90}
                        />
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            alignItems: "flex-end",
                            justifyContent: "flex-end"
                        }}>
                            <Box>
                                <Typography variant="body2" align="right" fontWeight="bold">Real Smart Global Pvt Ltd</Typography>
                                <Typography variant="body2" align="right">176/1 Nawala road</Typography>
                                <Typography variant="body2" align="right">Nugegoda</Typography>
                                <Typography variant="body2" align="right">Sri Lanka</Typography>
                                <Typography variant="body2" align="right">marketingrealsmart@gmail.com</Typography>
                            </Box>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                alignItems: "flex-end",
                                justifyContent: "flex-end"
                            }}>
                                <Box>
                                    <Typography variant="body2" align="right" fontWeight="bold">Branch Name</Typography>
                                    <Typography variant="body2" align="right">{payment.branchInfo.title.EN}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" align="right" fontWeight="bold">Issue date</Typography>
                                    <Typography variant="body2" align="right">{payment.paymentDate}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Divider />



                    {/* Invoice Details */}
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        width: "100%",
                        marginBottom: 3
                    }}>
                        <Box>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: 2
                            }}>
                                <Typography fontSize="26px" align="left" fontWeight="bold">RECEIPT</Typography>
                                <Typography fontSize="12px" align="left">
                                    # PAY-{payment.id}
                                </Typography>
                            </Box>
                            <Typography variant="body2" mt={3}>Student Details: </Typography>
                            <Typography variant="body2" mt={0.5}><strong>{payment.studentInfo?.fullName}</strong></Typography>
                            <Typography variant="body2" mt={0.5}>{payment.studentInfo?.passportNo}</Typography>
                        </Box>
                    </Box>

                    {/* Invoice Table */}
                    <Table sx={{
                        borderCollapse: 'collapse',
                        width: '100%',
                        '& th, & td': {
                            padding: '8px',
                        },
                        '& th': {
                            color: 'black',
                            borderBottomWidth: "1px",
                            backgroundColor: "transparent",
                            borderBottomColor: "black"
                        }
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ padding: '10px', width: "70%", fontWeight: "bold" }}>Description</TableCell>
                                <TableCell sx={{ padding: '10px', fontWeight: "bold" }} align='right'>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ padding: '10px', width: "70%" }}>#INV {payment.invoiceInfo?.id} - {payment.paymentTypeInfo?.title.EN}</TableCell>
                                <TableCell sx={{ padding: '10px' }} align='right'>{`LKR `}{payment.amountLkr.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Table sx={{
                        borderCollapse: 'collapse',
                        width: '100%',
                        '& th, & td': {
                            padding: '8px',
                        },
                        '& th': {
                            color: 'black',
                            borderBottomWidth: "1px",
                            backgroundColor: "transparent",
                            borderBottomColor: "black"
                        }
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ padding: '10px', width: "70%", fontWeight: "bold" }}>Total</TableCell>
                                <TableCell sx={{ padding: '10px', fontWeight: "bold" }} align='right'>{`LKR `}{payment.amountLkr.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>

                    <Box mt={2} ml={1}>
                        <Typography>
                            {payment.invoiceInfo?.updatePackageId
                                ? `(${payment.invoiceInfo.updatePackage?.title}-${payment.invoiceInfo.updatePackage?.id})`
                                : `(${payment.invoiceInfo?.packageInfo?.title}-${payment.invoiceInfo?.packageInfo?.id})`}
                        </Typography>
                        {payment.invoiceInfo.updatePackageId && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'blue',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    fontSize: '10px'
                                }}
                            >
                                New Package
                            </Typography>
                        )}
                        {payment.invoiceInfo.updatePackageId && (
                            <Box sx={{ marginTop: 1 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: '12px',
                                        color: '#6b7280', // muted gray
                                        textDecoration: 'line-through',
                                    }}
                                >
                                    ( {payment.invoiceInfo.packageInfo?.title} (#PAK-{payment.invoiceInfo.packageInfo?.id}))
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: '9px',
                                        color: '#a1a1a1',
                                        textTransform: 'uppercase',
                                        fontWeight: 'bold',
                                        textDecoration: 'line-through',
                                    }}
                                >
                                    Old Package
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    {/* Invoice Totals */}
                    {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Table sx={{ width: '50%' }}>
                        <TableBody>
                            <TableRow>
                                <TableCell align="right" sx={{ padding: '10px' }}>Sub Total</TableCell>
                                <TableCell align="right" sx={{ padding: '10px' }}>{`LKR `}{invoice.totalPrice.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                            <TableRow sx={{ backgroundColor: "#f8f8f8" }}>
                                <TableCell align="right" sx={{ padding: '10px', fontWeight: 'bold' }}>Total</TableCell>
                                <TableCell align="right" sx={{ padding: '10px', fontWeight: 'bold' }}>{`LKR `}{invoice.totalPrice.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box> */}

                    {/* Footer */}
                    <Box sx={{ mt: 10 }}>
                        <Typography variant="body2">Thank you for your trust in us. For any inquiries, reach out at marketingrealsmart@gmail.com.</Typography>
                        <Typography variant="body2">We appreciate your business!</Typography>
                    </Box>
                </Box>
            </Box>
            <ToastContainer />
        </>
    );
};

export default Payment;

