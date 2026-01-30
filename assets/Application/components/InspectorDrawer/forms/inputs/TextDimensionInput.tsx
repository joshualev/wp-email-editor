// Domain/Blocks/ImageBlock/components/helpers/inputs/TextDimensionInput.tsx

import React from 'react';
import { TextField, InputAdornment, Box, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';

export interface TextDimensionInputProps {
  label: string;
  defaultValue: number | null | undefined;
  onChange: (v: number | null) => void;
  min?: number; // Optional minimum value
  max?: number; // Optional maximum value
}

const TextDimensionInput: React.FC<TextDimensionInputProps> = ({
  label,
  defaultValue,
  onChange,
  min,
  max,
}) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const value = parseInt(ev.target.value, 10);
    let validatedValue = isNaN(value) ? null : value;

    if (validatedValue !== null) {
      if (min !== undefined && validatedValue < min) {
        validatedValue = min;
      }
      if (max !== undefined && validatedValue > max) {
        validatedValue = max;
      }
    }

    onChange(validatedValue);
  };

  return (
    <Box display="flex" flexDirection="column" gap={0.5} width="100%">
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
      <TextField
        fullWidth
        onChange={handleChange}
        value={defaultValue ?? ''}
        variant="outlined"
        placeholder="auto"
        size="small"
        type="number"
        InputProps={{
          startAdornment: min !== undefined ? (
            <InputAdornment position="start">Min: {min}px</InputAdornment>
          ) : null,
          endAdornment: <InputAdornment position="end">px</InputAdornment>,
          inputProps: {
            min: min, // Set the min attribute if provided
            max: max, // Set the max attribute if provided
          },
        }}
        sx={(theme: Theme) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            backgroundColor: theme.palette.background.paper,
            '& fieldset': {
              borderColor: theme.palette.grey[400],
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main,
              borderWidth: '1px',
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
              borderWidth: '1.5px',
              boxShadow: `0 0 0 1.5px ${theme.palette.primary.light}`,
            },
          },
          '& .MuiInputAdornment-root': {
            fontSize: '0.875rem',
            color: theme.palette.text.secondary,
          },
          '& .MuiOutlinedInput-input': {
            padding: '4px 8px',
          },
          '& .MuiInputLabel-root': {
            marginBottom: '4px',
          },
        })}
      />
    </Box>
  );
};

export default TextDimensionInput;
