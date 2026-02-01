// domain/blocks/ImageBlock/components/helpers/inputs/TextDimensionInput.tsx

import React from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';

export interface TextDimensionInputProps {
  label: string;
  defaultValue: number | null | undefined;
  onChange: (v: number | null) => void;
}

const TextDimensionInput: React.FC<TextDimensionInputProps> = ({
  label,
  defaultValue,
  onChange,
}) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const value = parseInt(ev.target.value, 10);
    const validatedValue = isNaN(value) ? null : value;
    onChange(validatedValue);
  };

  return (
    <Box display="flex" flexDirection="column" gap={0.5} width="100%">
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
      <Box display="flex" alignItems="center" gap={1} width="100%">
        <TextField
          fullWidth
          onChange={handleChange}
          value={defaultValue ?? ''}
          variant="outlined"
          placeholder="auto"
          size="small"
          type="number"
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
            '& .MuiOutlinedInput-input': {
              padding: '4px 8px',
            },
          })}
        />
        <Typography variant="body2" color="textSecondary">
          px
        </Typography>
      </Box>
    </Box>
  );
};

export default TextDimensionInput;
