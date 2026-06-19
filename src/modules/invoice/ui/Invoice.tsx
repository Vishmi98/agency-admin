"use client"

import React, { useRef } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Divider, Stack } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

import { InvoiceProp } from '../invoice.types';


const Invoice: React.FC<InvoiceProp> = ({ invoice, setIsModalOpen }) => {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        const html2pdf = (await import("html2pdf.js")).default;
        const element = invoiceRef.current;
        if (!element) return;

        const options = {
            margin: 0.5,
            filename: `invoice-${invoice.id}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        html2pdf().set(options).from(element).save();
    };

    // Helper to safely convert to number
    const toNumber = (value: string | number | undefined) =>
        Number(value ?? 0);

    // Base package price (LKR)
    const packagePriceLkr = toNumber(invoice.packageInfo?.priceInLkr);

    // Extra payments total
    const extraPaymentsTotal =
        invoice?.extraPaymentInfo?.reduce(
            (sum, item) => sum + toNumber(item.amount),
            0
        ) || 0;

    // Discounts total
    const discountTotal =
        invoice?.discountInfo?.reduce(
            (sum, item) => sum + toNumber(item.amount),
            0
        ) || 0;

    // Payments already made
    const paidTotal =
        invoice?.paymentInfo?.reduce(
            (sum, item) => sum + toNumber(item.amountLkr),
            0
        ) || 0;

    // Subtotal (package + extras)
    const subTotal = packagePriceLkr + extraPaymentsTotal;

    // Final Total after discount
    const finalTotal = subTotal - discountTotal;

    // Due amount
    const difference = finalTotal - invoice.totalPrice;

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
                <Box ref={invoiceRef} padding={3}>
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
                                    <Typography variant="body2" align="right">{invoice.branchInfo?.title.EN}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" align="right" fontWeight="bold">Issue date</Typography>
                                    <Typography variant="body2" align="right">{invoice.invoiceDate}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Divider />

                    {/* Invoice Details */}
                    <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: 2
                        }}>
                            <Typography fontSize="26px" align="left" fontWeight="bold">INVOICE</Typography>
                            <Typography fontSize="12px" align="left">
                                # INV-{invoice.id}
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: 2,
                            alignItems: 'end'
                        }}>
                            <Typography fontSize="18px" align="left" fontWeight="bold">Due Amount</Typography>
                            <Typography fontSize="14px" align="left" fontWeight={'bold'}>
                                {`LKR `}{invoice.dueAmount.toLocaleString('en-US')}
                            </Typography>
                        </Box>
                    </Stack>
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        width: "100%",
                        marginBottom: 3
                    }}>
                        <Box>
                            <Typography variant="body2" mt={3}>Student Details: </Typography>
                            <Typography variant="body2" mt={0.5}><strong>{invoice.studentInfo?.titleInfo.title.EN} {invoice.studentInfo?.firstName} {invoice.studentInfo?.lastName}</strong></Typography>
                            <Typography variant="body2" mt={0.5}>{invoice.studentInfo?.email}</Typography>
                            <Typography variant="body2" mt={0.5}>{invoice.studentInfo?.phone}</Typography>
                        </Box>
                    </Box>

                    {/* Invoice Table */}
                    <Table sx={{
                        borderCollapse: 'collapse',
                        width: '100%',
                        '& th, & td': {
                            border: '1px solid gray',
                            padding: '8px',
                        },
                        '& th': {
                            backgroundColor: '#333',
                            color: 'white'
                        }
                    }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#333' }}>
                                <TableCell sx={{ color: 'white', padding: '10px' }}>#</TableCell>
                                <TableCell sx={{ color: 'white', padding: '10px', width: "60%" }}>Description</TableCell>
                                <TableCell sx={{ color: 'white', padding: '10px' }} align='right'></TableCell>
                                <TableCell sx={{ color: 'white', padding: '10px' }} align='right'>Amount (LKR)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ padding: '10px' }}>1</TableCell>
                                <TableCell sx={{ padding: '10px' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        {/* The Package Title and ID */}
                                        <Typography variant="body2">
                                            {invoice.updatePackageId
                                                ? `${invoice.updatePackage?.title} (#PAK-${invoice.updatePackage?.id})`
                                                : `${invoice.packageInfo?.title} (#PAK-${invoice.packageInfo?.id})`}
                                        </Typography>

                                        {/* The "New Package" Label */}
                                        {invoice.updatePackageId && (
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
                                        {invoice.updatePackageId && (
                                            <Box sx={{ marginTop: 1 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: '12px',
                                                        color: '#6b7280', // muted gray
                                                        textDecoration: 'line-through',
                                                    }}
                                                >
                                                    {invoice.packageInfo?.title} (#PAK-{invoice.packageInfo?.id})
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
                                </TableCell>
                                <TableCell sx={{ padding: '10px' }} align='right'>{`USD `}{invoice.updatePackageId ? invoice.updatePackage?.price : invoice.packageInfo?.price}</TableCell>
                                {invoice.updatePackageId ?
                                    <TableCell sx={{ padding: '10px', }} align='right'>{invoice.updatePackage?.priceInLkr.toLocaleString('en-US')}</TableCell> :
                                    <TableCell sx={{ padding: '10px', color: difference > 0 ? "green" : "black" }} align='right'>{(Number(invoice.packageInfo?.priceInLkr) - difference).toLocaleString('en-US')}</TableCell>
                                }
                            </TableRow>
                            {invoice?.extraPaymentInfo.map((pay, index) => (
                                <TableRow sx={{ bgcolor: index % 2 == 0 ? "#f8f8f8" : "" }} key={index}>
                                    <TableCell sx={{ padding: '10px' }}>{index + 2}</TableCell>
                                    <TableCell sx={{ padding: '10px' }}>{pay.title.EN}</TableCell>
                                    <TableCell sx={{ padding: '10px' }} align='right'></TableCell>
                                    <TableCell sx={{ padding: '10px' }} align='right'>{pay.amount === 0 ? '0.00' : pay.amount.toLocaleString('en-US')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Invoice Totals */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Table sx={{ width: '60%' }}>
                            <TableBody>
                                {invoice?.discountInfo?.map((discount, index) => (
                                    <TableRow key={index}>
                                        <TableCell align='right'></TableCell>
                                        <TableCell align='right' sx={{ color: "#19e434" }}>{discount.title.EN} (Discount)</TableCell>
                                        <TableCell align='right' sx={{ color: "#19e434" }}>- {`LKR `} {discount.amount === 0 ? '0.00' : discount.amount.toLocaleString('en-US')}</TableCell>
                                    </TableRow>
                                ))}

                                {/* <TableRow sx={{ backgroundColor: "#ccc" }}>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right">Updated Total</TableCell>
                                    <TableCell align="right"> {`LKR `}{finalTotal.toLocaleString('en-US')}</TableCell>
                                </TableRow>
                                <TableRow sx={{ backgroundColor: "#ef4444" }}>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right">Total difference</TableCell>
                                    <TableCell align="right">
                                        {`LKR `}{(finalTotal - invoice.totalPrice).toLocaleString('en-US')}
                                    </TableCell>
                                </TableRow> */}
                                <TableRow>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right">Sub Total</TableCell>
                                    <TableCell align="right">{`LKR `}{invoice.totalPrice.toLocaleString('en-US')}</TableCell>
                                </TableRow>
                                {invoice?.paymentInfo?.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell align="right" sx={{ color: "#ef4444" }}># PAY-{payment.id}</TableCell>
                                        <TableCell align='right' sx={{ color: "#ef4444" }}>{payment.paymentDate}</TableCell>
                                        <TableCell align='right' sx={{ color: "#ef4444" }}>{`LKR `} {payment.amountLkr.toLocaleString('en-US')}</TableCell>
                                    </TableRow>
                                ))}
                                {invoice.updatePackageId && (
                                    <TableRow>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right">
                                            <span style={{ textDecoration: "line-through" }}>Old Total</span>
                                        </TableCell>
                                        <TableCell align="right">
                                            <span style={{ textDecoration: "line-through" }}>
                                                {`LKR ${(invoice.totalPrice - invoice.difference).toLocaleString("en-US")}`}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                )}
                                <TableRow sx={{ backgroundColor: "#f8f8f8" }}>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{`LKR `}{invoice.totalPrice.toLocaleString('en-US')}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>

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

export default Invoice;