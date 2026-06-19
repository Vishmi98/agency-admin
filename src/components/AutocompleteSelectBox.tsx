import React from 'react';
import { Autocomplete, TextField, FormControl, Paper } from '@mui/material';

import { AutoCompleteBoxProps } from '@/type/common.types';


const SelectBox: React.FC<AutoCompleteBoxProps> = ({
    labelId,
    id,
    label,
    fullWidth = false,
    value,
    onChange,
    size = 'medium',
    options = [],
    disabled = false,
    ...props
}) => {
    const selectedOption = options.find(option => option.value === value) || null;

    return (
        <FormControl fullWidth={fullWidth} disabled={disabled} {...props}>
            <Autocomplete
                id={id}
                options={options}
                getOptionLabel={(option) => option.label || ''}
                value={selectedOption}
                onChange={onChange}
                size={size}
                disabled={disabled}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        InputLabelProps={{
                            id: `${labelId}`,
                            style: { color: 'gray' },
                        }}
                        variant="outlined"
                    />
                )}
                PaperComponent={({ children }) => (
                    <Paper>{children}</Paper>
                )}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                sx={{ PaperProps: { style: { maxHeight: 200, width: 250 } } }}
            />
        </FormControl>
    );
}

export default SelectBox;
