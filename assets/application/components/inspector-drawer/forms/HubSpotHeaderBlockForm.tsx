import React from 'react';
import { Box, Typography, FormControlLabel, Switch, styled } from '@mui/material';
import ColorInput from './inputs/color-input/ColorInput';
import { HubSpotHeaderBlockPropsType } from '@/domain/blocks';

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      color: theme.palette.primary.main,
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 0.7,
      },
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#bdbdbd',
    opacity: 1,
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
}));

type HubSpotHeaderBlockFormProps = {
  data: HubSpotHeaderBlockPropsType;
  setData: (v: HubSpotHeaderBlockPropsType) => void;
};

export default function HubSpotHeaderBlockForm({ data, setData }: HubSpotHeaderBlockFormProps) {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <StyledSwitch
              checked={data.fullWidth}
              onChange={(e) => setData({ ...data, fullWidth: e.target.checked })}
            />
          }
          label={
            <Typography variant="body2">
              Full Width Background
            </Typography>
          }
        />
      </Box>

      <ColorInput
        label="Background Color"
        defaultValue={data.backgroundColor}
        onChange={(color) => setData({ ...data, backgroundColor: color })}
      />
    </>
  );
}
