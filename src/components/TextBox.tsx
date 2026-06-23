"use client"

import React from 'react';
import { TextField, FormControl } from '@mui/material';
import { Field } from 'formik';

import { TextBoxProps } from '@/type/common.types';


const TextBox: React.FC<TextBoxProps> = ({
    name,
    fullWidth = false,
    size = 'small',
    type,
    error = false,
    helperText = "",
    label,
    multiline = false,
    rows,
    disabled,
}) => {
    return (
        <FormControl fullWidth={fullWidth} size={size}>
            <Field
                as={TextField}
                name={name}
                fullWidth={fullWidth}
                size={size}
                type={type}
                error={error}
                helperText={helperText}
                label={label}
                multiline={multiline}
                rows={rows}
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}
                disabled={disabled}
                sx={{
                    "& .MuiFormHelperText-root": {
                        marginLeft: 0,
                        color: "error.main"
                    },
                }}
            />
        </FormControl>
    );
}

export default TextBox;
