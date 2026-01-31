import React, { useCallback } from 'react';
import { Stack, TextField, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

type ColumnControlProps = {
  value: {
    count: number;
    widths: number[];
  };
  onChange: (value: { count: number; widths: number[] }) => void;
};

const WidthInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  '& input': {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    '&[type=number]': {
      MozAppearance: 'textfield',
    },
  },
}));

export const ColumnControl: React.FC<ColumnControlProps> = ({ value, onChange }) => {
  const handleWidthChange = useCallback((index: number, newWidth: number) => {
    if (isNaN(newWidth)) return;

    const updatedWidths = [...value.widths.slice(0, value.count)];
    updatedWidths[index] = newWidth;

    // For two columns, ensure they sum to 600
    const otherIndex = index === 0 ? 1 : 0;
    updatedWidths[otherIndex] = 600 - newWidth;

    onChange({ count: value.count, widths: updatedWidths });
  }, [value, onChange]);

  const handleCountChange = (newCount: number) => {
    const count = Math.max(1, Math.min(4, newCount));
    const equalWidth = Math.floor(600 / count / 50) * 50;
    const newWidths = Array(count).fill(equalWidth);

    onChange({ count, widths: newWidths });
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="caption" color="text.secondary">Number of columns</Typography>
        <TextField
          type="number"
          value={value.count}
          onChange={(e) => handleCountChange(Number(e.target.value))}
          inputProps={{ min: 1, max: 4 }}
          fullWidth
          size="small"
        />
      </Box>

      {value.count === 2 && (
        <Stack spacing={1}>
          {[0, 1].map((index) => (
            <Box key={index}>
              <Typography variant="caption" color="text.secondary">
                Column {index + 1} Width (px)
              </Typography>
              <WidthInput
                type="number"
                value={value.widths[index]}
                onChange={(e) => handleWidthChange(index, Number(e.target.value))}
                inputProps={{ 
                  min: 150,
                  max: 450,
                  step: 50,
                  'aria-label': `Column ${index + 1} width`
                }}
                fullWidth
                size="small"
              />
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
};