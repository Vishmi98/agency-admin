"use client";

import React from "react";
import { Grid, Typography, } from "@mui/material";

import { StudentDataType } from "@/modules/student/student.types";


const StudentDetails = (props: { student: StudentDataType | undefined }) => {

    const { student } = props

    return (
        <Grid sx={{
            borderWidth: 3,
            borderStyle: 'solid',
            borderColor: '#edeef0',
            borderRadius: 2,
            padding: 1,
            marginTop: 1
        }}>
            {student && <>
                <Typography variant="h6" >Student Details</Typography>
                <Typography variant="body1" mt={1}>
                    <b>Name:</b> {student?.fullName}
                </Typography>
                <Typography variant="body1">
                    <b>Phone number:</b> {student?.phone}
                </Typography>
                <Typography variant="body1">
                    <b>Passport number:</b> {student?.passportNo}
                </Typography>
            </>}
        </Grid>

    );
};

export default StudentDetails;
