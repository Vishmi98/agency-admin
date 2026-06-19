"use client";

import React from "react";
import { Box, Grid, Typography, } from "@mui/material";

import { InvoiceDataType } from "@/modules/invoice/invoice.types";


const InvoiceDetails = (props: { invoice: InvoiceDataType | null }) => {

    const { invoice } = props

    return (
        <Grid sx={{
            borderWidth: 3,
            borderStyle: 'solid',
            borderColor: '#edeef0',
            borderRadius: 2,
            padding: 1,
            marginTop: 1
        }}>
            {invoice &&
                <Box sx={{ display: "flex", gap: 2, width: "100%", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Box>
                        <Typography variant="h6" mb={1} color={'#989a9c'}>Invoice Details</Typography>
                        <Typography variant="body1">
                            <b style={{ color: '##989a9c' }}>Package title:</b> {invoice.updatePackageId
                                ? `${invoice.updatePackage?.title} (#PAK-${invoice.updatePackage?.id})`
                                : `${invoice.packageInfo?.title} (#PAK-${invoice.packageInfo?.id})`}
                        </Typography>
                        <Typography variant="body1">
                            <b style={{ color: '##989a9c' }}>Package price:</b> {`LKR`} {invoice.updatePackageId ? invoice.updatePackage?.priceInLkr.toLocaleString('en-US') : invoice?.packageInfo.priceInLkr.toLocaleString('en-US')}
                        </Typography>
                        <Typography variant="body1">
                            <b style={{ color: '##989a9c' }}>Invoice date:</b> {invoice?.invoiceDate}
                        </Typography>
                        {/* <Typography variant="body1">
                            <b style={{ color: '##989a9c' }}>Exchange rate:</b> {invoice?.exchangeRate}
                        </Typography> */}
                        <Typography variant="body1">
                            <b style={{ color: '##989a9c' }}>Staff name:</b> {invoice?.staffInfo?.firstName} {invoice?.staffInfo?.lastName} ({invoice?.staffInfo?.id})
                        </Typography>
                        <Typography variant="body1">
                            <b style={{ color: '##989a9c' }}>Extra Payments:</b>
                        </Typography>
                        {invoice.extraPaymentInfo.map((extra, index) => (
                            <Typography key={index} variant="body1">
                                {extra.title.EN} - <span>{extra.currency ? `(${extra.currency})` : '(LKR)'} {extra.amount.toLocaleString('en-US')}</span>
                            </Typography>
                        ))}
                        <Typography variant="body1">
                            <b style={{ color: '##989a9c' }}>Discounts:</b>
                        </Typography>
                        {invoice.discountInfo.map((dis, index) => (
                            <Typography key={index} variant="body1">
                                {dis.title.EN} - <span>{dis.currency ? `(${dis.currency})` : '(LKR)'} {dis.amount.toLocaleString('en-US')}</span>
                            </Typography>
                        ))}
                        <Typography variant="body1">
                            <b>Due Amount:</b><span style={{ color: 'orange', fontWeight: 'bold' }}>{`(LKR)`} {invoice?.dueAmount?.toLocaleString('en-US')} </span>
                        </Typography>
                        <Typography variant="body1">
                            <b>Final Total:</b><span style={{ color: 'blue', fontWeight: 'bold' }}>{`(LKR)`} {invoice?.totalPrice?.toLocaleString('en-US')}</span>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6" mb={1} color={'#989a9c'}>Student Details</Typography>
                        <Typography variant="body1">
                            <b>Student name:</b> {invoice?.studentInfo?.titleInfo.title.EN} {invoice.studentInfo?.firstName} {invoice.studentInfo?.lastName}
                        </Typography>
                        <Typography variant="body1">
                            <b>Phone number:</b> {invoice?.studentInfo?.phone}
                        </Typography>
                        <Typography variant="body1">
                            <b>Email:</b> {invoice?.studentInfo?.email}
                        </Typography>
                        <Typography variant="body1">
                            <b>Staff name:</b> {invoice?.staffInfo?.firstName} {invoice?.staffInfo?.lastName} ({invoice?.staffInfo?.id})
                        </Typography>
                    </Box>
                </Box>
            }
        </Grid>

    );
};

export default InvoiceDetails;
