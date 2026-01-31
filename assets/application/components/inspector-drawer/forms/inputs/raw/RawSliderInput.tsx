import React from 'react';

import { Box, Slider, Stack, Typography } from '@mui/material';

type SliderInputProps = {
  iconLabel: JSX.Element;

  step?: number;
  marks?: boolean;
  units: string;
  min?: number;
  max?: number;

  value: number;
  setValue: (v: number) => void;
};

export default function RawSliderInput({ iconLabel, value, setValue, units, ...props }: SliderInputProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={2} width="100%">
      <Box 
        sx={{ 
          minWidth: 24, 
          lineHeight: 1, 
          flexShrink: 0,
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {iconLabel}
      </Box>
      <Slider
        {...props}
        size="small"
        sx={{
          '& .MuiSlider-thumb': {
            width: 12,
            height: 12,
          },
          '& .MuiSlider-track': {
            height: 2,
          },
          '& .MuiSlider-rail': {
            height: 2,
          }
        }}
        value={value}
        onChange={(_, value: unknown) => {
          if (typeof value !== 'number') {
            throw new Error('RawSliderInput values can only receive numeric values');
          }
          setValue(value);
        }}
      />
      <Box 
        sx={{ 
          minWidth: 40, 
          textAlign: 'center', 
          flexShrink: 0,
          backgroundColor: 'action.hover',
          borderRadius: 0.5,
          px: 0.5,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
          {value}{units}
        </Typography>
      </Box>
    </Stack>
  );
}