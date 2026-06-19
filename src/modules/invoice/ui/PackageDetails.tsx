"use client";

import React from "react";
import { Grid, Typography, } from "@mui/material";

import { PackageDataType } from "@/modules/packages/package.types";


const PackageDetails = (props: { package_: PackageDataType | undefined }) => {

    const { package_ } = props

    return (
        <Grid sx={{
            borderWidth: 3,
            borderStyle: 'solid',
            borderColor: '#edeef0',
            borderRadius: 2,
            padding: 1,
            marginTop: 1
        }}>
            {package_ && <>
                <Typography variant="h6" mb={1}>Package Details</Typography>
                <Typography variant="body1">
                    <b>Title:</b> {package_?.title}
                </Typography>
                <Typography variant="body1">
                    <b>Course name:</b> {package_?.courseName}
                </Typography>
                <Typography variant="body1">
                    <b>Price:</b> LKR {package_?.priceInLkr?.toLocaleString('en-US')}
                </Typography>
                <Typography variant="body1">
                    <b>Start date:</b> {package_?.startDate}
                </Typography>
                <Typography variant="body1">
                    <b>Study type:</b> {package_?.studyTypeInfo?.title.EN}
                </Typography>
            </>}
        </Grid>

    );
};

export default PackageDetails;
