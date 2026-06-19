"use client"

import React from "react";
import { useField } from "formik";
import { TextField } from "@mui/material";

import { PickerProps } from "@/type/common.types";


const DateTimePicker: React.FC<PickerProps> = ({
    name,
    label
}) => {
    const [field, meta] = useField(name);

    return (
        <>
            {/* <Typography gutterBottom fontSize="small">
                {label}
            </Typography> */}
            <TextField
                sx={{ color: 'gray' }}
                {...field}
                label={label}
                name={name}
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
                size='small'
            />
        </>
    );
};

export default DateTimePicker