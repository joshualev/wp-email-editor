import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Select,
  MenuItem,
  SelectChangeEvent,
  SxProps,
  Theme,
  Box,
  Stack
} from '@mui/material';

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: theme.spacing(1, 1.5),
    fontSize: '0.875rem',
  },
}));

interface SelectOption {
  label: string;
  value: string | number;
  sx?: SxProps<Theme>;
}

interface SelectInputProps {
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  sx?: SxProps<Theme>;
  showLabel?: boolean;
  fullWidth?: boolean;
}

export default function SelectInput({ 
  label, 
  value, 
  onChange, 
  options,
  sx,
  showLabel = false,
  fullWidth = false
}: SelectInputProps) {
  const handleChange = (
    event: SelectChangeEvent<unknown>,
  ) => {
    const newValue = event.target.value as string | number;
    onChange(newValue);
  };

  return (
    <Stack 
      spacing={0.75} 
      sx={{ flexGrow: fullWidth ? 1 : 'unset' }}
    >
      {showLabel && label && (
        <Box sx={{ typography: 'body2', color: 'text.secondary', pl: 0.5 }}>
          {label}
        </Box>
      )}
      <StyledSelect
        size="small"
        value={value}
        onChange={handleChange}
        sx={sx}
        variant='outlined'
      >
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value}
            sx={option.sx}
            disableRipple
          >
            {option.label}
          </MenuItem>
        ))}
      </StyledSelect>
    </Stack>
  );
}