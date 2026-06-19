import React from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import { SelectBoxProps } from '@/type/common.types';


const SelectBox: React.FC<SelectBoxProps> = ({
    id,
    name,
    label,
    fullWidth = false,
    value,
    onChange,
    size = 'medium',
    options = [],
    disabled = false,
    color,
    ...props
}) => {
    return (
        <FormControl fullWidth className='' size='small' disabled={disabled} {...props} sx={{ backgroundColor: {color}}}>
            <InputLabel id={`${id}-label`} sx={{ color: 'gray' }}>{label}</InputLabel>
            <Select
                label={label}
                labelId={`${id}-label`}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                fullWidth={fullWidth}
                size={size}
                MenuProps={{ PaperProps: { style: { maxHeight: 200, width: 250 } } }} // Set maxHeight and width for scrollable dropdown
                disabled={disabled}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default SelectBox;
