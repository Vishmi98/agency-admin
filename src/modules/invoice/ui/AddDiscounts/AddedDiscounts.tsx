"use client";

import React from "react";
import { Box, Stack, Typography, } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { AddedDiscountsType } from "../../invoice.types";


const AddedDiscounts = ({
    selectedDiscounts,
    totalPrice,
    selectedInvoice,
    removeDiscount,
}: AddedDiscountsType) => {

    return (
        <Box sx={{ marginTop: "16px" }}>
            <Box>
                <Typography variant="h6" pb={1.2}>Added Discounts:</Typography>
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
                            {selectedInvoice && (
                                selectedInvoice?.updatePackageId
                                    ? `LKR ${selectedInvoice?.updatePackage?.priceInLkr?.toLocaleString('en-US')}`
                                    : `LKR ${(
                                        Number(selectedInvoice?.packageInfo?.priceInLkr || 0) -
                                        Number(selectedInvoice?.packagePriceUpdatePrice || 0)
                                    ).toLocaleString('en-US')}`
                            )}
                        </Typography>
                    </Stack>
                </Stack>

                {selectedInvoice && selectedInvoice.discountInfo?.length > 0 && selectedInvoice.discountInfo.map((discount) => (
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
                        <Typography variant="body2" mt={1}>
                            {discount.title.EN}
                        </Typography>
                        <Stack sx={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="body2" mt={1}>
                                LKR  {discount.amount.toLocaleString('en-US')}
                            </Typography>
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
                                sx={{ fontSize: 20, paddingTop: 0.8 }} />
                        </Stack>
                    </Stack>
                ))}

                <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="body2" mt={1} sx={{ fontWeight: "bold" }}>
                        Total price
                    </Typography>
                    <Typography variant="body2" mt={1} sx={{ fontWeight: "bold" }}>
                        {'LKR'} {totalPrice.toLocaleString('en-US')}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
};

export default AddedDiscounts;
