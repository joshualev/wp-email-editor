import React from 'react';
import { styled } from '@mui/material/styles';
import { 
  ToggleButton, 
  ToggleButtonGroup, 
  Box, 
  Stack,
  SxProps,
  Theme 
} from '@mui/material';

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(0.75, 1.5),
    minWidth: 'auto',
    fontSize: '0.875rem',
    '&.Mui-selected': {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.text.primary,
      fontWeight: 500,
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
    },
  },
}));

interface ToggleOption {
  label: string | React.ReactNode;
  value: string | number;
}

interface ToggleButtonGroupInputProps {
  label?: string;
  value: string | number;
  onChange: (value: any) => void;
  options: ToggleOption[];
  sx?: SxProps<Theme>;
  showLabel?: boolean;
  exclusive?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function ToggleButtonGroupInput({
  label,
  value,
  onChange,
  options,
  sx,
  showLabel = false,
  exclusive = true,
  size = 'small'
}: ToggleButtonGroupInputProps) {
  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string | number | null
  ) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <Stack spacing={0.75}>
      {showLabel && label && (
        <Box sx={{ typography: 'body2', color: 'text.secondary', pl: 0.5 }}>
          {label}
        </Box>
      )}
      <StyledToggleButtonGroup
        size={size}
        value={value}
        exclusive={exclusive}
        onChange={handleChange}
        sx={sx}
      >
        {options.map((option) => (
          <ToggleButton key={option.value} value={option.value}>
            {option.label}
          </ToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </Stack>
  );
}