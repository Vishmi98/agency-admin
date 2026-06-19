"use client";

import React from "react";
import { Box, Stack, Typography, } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { AddedExtraPaymentsProps } from "../../invoice.types";


const AddedExtraPayments = ({
    selectedExtraPayments,
    selectedDiscounts,
    totalPrice,
    selectedPackagePrice,
    calculateTotalPrice,
    removeExtraPayment,
    removeDiscount
}: AddedExtraPaymentsProps) => {

    calculateTotalPrice()

    return (
        <Box sx={{ marginTop: "16px" }}>
            <Box>
                <Typography variant="h6" pb={1.2}>Added Extra Payments & Discounts:</Typography>
                {selectedPackagePrice &&
                    <Stack
                        sx={{
                            width: "100%",
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: "space-between",
                            bgcolor: '',
                            paddingBottom: 1,
                            paddingX: 1,
                            borderWidth: 3,
                            borderStyle: 'solid',
                            borderColor: '#edeef0',
                            borderRadius: 2,
                            marginBottom: 0.5
                        }}>
                        <Typography variant="body2" mt={1}>
                            Package Price
                        </Typography>
                        <Stack sx={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="body2" mt={1}>
                                LKR {selectedPackagePrice.toLocaleString('en-US')}
                            </Typography>
                            <CloseIcon onClick={() => { }}
                                sx={{ fontSize: 20, paddingTop: 1 }} />
                        </Stack>
                    </Stack>
                }
                {selectedExtraPayments.length > 0 && selectedExtraPayments.map((payment, index) => (
                    <Stack key={payment.id}
                        sx={{
                            width: "100%",
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: "space-between",
                            bgcolor: '',
                            paddingBottom: 1,
                            paddingX: 1,
                            borderWidth: 3,
                            borderStyle: 'solid',
                            borderColor: '#edeef0',
                            borderRadius: 2,
                            marginBottom: 0.5
                        }}>
                        <Typography key={index} variant="body2" mt={1}>
                            {payment.title.EN}
                        </Typography>
                        <Stack>

                        </Stack>
                        <Stack sx={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography key={index} variant="body2" mt={1}>
                                {payment.currency}  {payment.amount.toLocaleString('en-US')}
                            </Typography>
                            <CloseIcon onClick={() => removeExtraPayment(payment.id)}
                                sx={{ fontSize: 20, paddingTop: 1 }} />
                        </Stack>
                    </Stack>
                ))}
                {selectedDiscounts.length > 0 && selectedDiscounts.map((discount, index) => (
                    <Stack key={discount.id}
                        sx={{
                            width: "100%",
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: "space-between",
                            bgcolor: '',
                            paddingBottom: 1,
                            paddingX: 1,
                            borderWidth: 3,
                            borderStyle: 'solid',
                            borderColor: '#edeef0',
                            borderRadius: 2,
                            marginBottom: 0.5
                        }}>
                        <Typography key={index} variant="body2" mt={1}>
                            {discount.title.EN}
                        </Typography>
                        <Stack>

                        </Stack>
                        <Stack sx={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography key={index} variant="body2" mt={1}>
                                {discount.currency}  {discount.amount.toLocaleString('en-US')}
                            </Typography>
                            <CloseIcon onClick={() => removeDiscount(discount.id)}
                                sx={{ fontSize: 20, paddingTop: 1 }} />
                        </Stack>
                    </Stack>
                ))}
                <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="body1" mt={1} sx={{ fontWeight: "bold" }}>
                        Total price
                    </Typography>
                    <Typography variant="body1" mt={1} mr={4} sx={{ fontWeight: "bold" }}>
                        {'LKR'} {totalPrice.toLocaleString('en-US')}
                    </Typography>
                </Box>
            </Box>
        </Box>)
};

export default AddedExtraPayments;
